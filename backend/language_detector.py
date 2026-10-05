from __future__ import annotations

import json
from pathlib import Path
from typing import Any


# ============================================================
# ACR_AGENT - Language / Framework / Project Detector
# ============================================================

IGNORED_DIRECTORIES = {
    ".git",
    ".next",
    "node_modules",
    "venv",
    ".venv",
    "env",
    "__pycache__",
    "dist",
    "build",
    "target",
    "bin",
    "obj",
    ".idea",
    ".vscode",
    "coverage",
    ".pytest_cache",
    ".mypy_cache",
}


LANGUAGE_EXTENSIONS = {
    "python": {".py"},
    "javascript": {".js", ".jsx", ".mjs", ".cjs"},
    "typescript": {".ts", ".tsx", ".mts", ".cts"},
    "java": {".java"},
    "c": {".c", ".h"},
    "cpp": {".cpp", ".cc", ".cxx", ".hpp", ".hh", ".hxx"},
    "csharp": {".cs"},
    "go": {".go"},
    "rust": {".rs"},
    "php": {".php"},
    "kotlin": {".kt", ".kts"},
}


LANGUAGE_NAMES = {
    "python": "Python",
    "javascript": "JavaScript",
    "typescript": "TypeScript",
    "java": "Java",
    "c": "C",
    "cpp": "C++",
    "csharp": "C#",
    "go": "Go",
    "rust": "Rust",
    "php": "PHP",
    "kotlin": "Kotlin",
}


PROJECT_MARKERS = {
    "package.json",
    "package-lock.json",
    "bun.lock",
    "bun.lockb",
    "pnpm-lock.yaml",
    "yarn.lock",
    "requirements.txt",
    "pyproject.toml",
    "Pipfile",
    "pom.xml",
    "build.gradle",
    "build.gradle.kts",
    "settings.gradle",
    "settings.gradle.kts",
    "Cargo.toml",
    "go.mod",
    "composer.json",
    "Makefile",
    "CMakeLists.txt",
}


PREFERRED_PROJECT_DIRECTORIES = (
    "frontend",
    "client",
    "web",
    "app",
    "ui",
    "website",
)


def _is_ignored(path: Path, root: Path) -> bool:
    """
    Check whether a path is inside an ignored directory.
    """
    try:
        relative = path.relative_to(root)
    except ValueError:
        return False

    return any(part in IGNORED_DIRECTORIES for part in relative.parts)


def _iter_files(root: Path):
    """
    Recursively yield files while skipping ignored directories.
    """
    if not root.exists() or not root.is_dir():
        return

    for path in root.rglob("*"):
        if not path.is_file():
            continue

        if _is_ignored(path, root):
            continue

        yield path


def _find_file(root: Path, filename: str) -> Path | None:
    """
    Find a specific filename recursively.
    """
    if not root.exists() or not root.is_dir():
        return None

    # Check root first.
    direct = root / filename
    if direct.is_file():
        return direct

    for path in _iter_files(root):
        if path.name == filename:
            return path

    return None


def _find_extension(root: Path, extension: str) -> Path | None:
    """
    Find a file by extension recursively.
    """
    if not root.exists() or not root.is_dir():
        return None

    extension = extension.lower()

    for path in _iter_files(root):
        if path.suffix.lower() == extension:
            return path

    return None


def _find_package_json(root: Path) -> Path | None:
    """
    Find package.json, preferring common frontend directories.
    """
    if not root.exists() or not root.is_dir():
        return None

    # 1. Check preferred frontend directories first.
    for directory in PREFERRED_PROJECT_DIRECTORIES:
        candidate = root / directory / "package.json"
        if candidate.is_file():
            return candidate

    # 2. Check root.
    candidate = root / "package.json"
    if candidate.is_file():
        return candidate

    # 3. Search recursively.
    candidates = []

    for path in _iter_files(root):
        if path.name == "package.json":
            candidates.append(path)

    if not candidates:
        return None

    # Prefer shallower paths.
    candidates.sort(key=lambda p: len(p.relative_to(root).parts))

    return candidates[0]


def _read_json(path: Path) -> dict[str, Any]:
    """
    Safely read a JSON file.
    """
    try:
        with path.open("r", encoding="utf-8") as file:
            data = json.load(file)

        if isinstance(data, dict):
            return data

    except Exception:
        pass

    return {}


def _detect_from_extensions(root: Path) -> str:
    """
    Detect the dominant programming language using file extensions.
    """
    counts: dict[str, int] = {
        language: 0 for language in LANGUAGE_EXTENSIONS
    }

    for path in _iter_files(root):
        suffix = path.suffix.lower()

        for language, extensions in LANGUAGE_EXTENSIONS.items():
            if suffix in extensions:
                counts[language] += 1
                break

    if not any(counts.values()):
        return "unknown"

    # Special case:
    # If TypeScript files exist, prefer TypeScript over JavaScript.
    if counts["typescript"] > 0:
        return "typescript"

    if counts["javascript"] > 0:
        return "javascript"

    return max(counts, key=counts.get)


def _detect_node_language(package_json_path: Path) -> str:
    """
    Detect JavaScript vs TypeScript from package.json and project files.
    """
    project_root = package_json_path.parent

    package_data = _read_json(package_json_path)

    dependencies = {}

    for section in (
        "dependencies",
        "devDependencies",
        "peerDependencies",
        "optionalDependencies",
    ):
        section_data = package_data.get(section, {})

        if isinstance(section_data, dict):
            dependencies.update(section_data)

    # TypeScript package is a strong signal.
    if "typescript" in dependencies:
        return "typescript"

    # Check actual source files.
    ts_files = 0
    js_files = 0

    for path in _iter_files(project_root):
        suffix = path.suffix.lower()

        if suffix in {".ts", ".tsx", ".mts", ".cts"}:
            ts_files += 1

        elif suffix in {".js", ".jsx", ".mjs", ".cjs"}:
            js_files += 1

    if ts_files > 0:
        return "typescript"

    if js_files > 0:
        return "javascript"

    return "javascript"


def _detect_framework(root: Path, language_id: str) -> str:
    """
    Detect the primary framework.
    """
    if language_id not in {"javascript", "typescript"}:
        if language_id == "python":
            requirements = _find_file(root, "requirements.txt")
            pyproject = _find_file(root, "pyproject.toml")

            content = ""

            if requirements:
                try:
                    content += requirements.read_text(
                        encoding="utf-8",
                        errors="ignore",
                    ).lower()
                except Exception:
                    pass

            if pyproject:
                try:
                    content += pyproject.read_text(
                        encoding="utf-8",
                        errors="ignore",
                    ).lower()
                except Exception:
                    pass

            if "fastapi" in content:
                return "FastAPI"

            if "flask" in content:
                return "Flask"

            if "django" in content:
                return "Django"

            return "Python"

        if language_id == "java":
            if _find_file(root, "pom.xml"):
                try:
                    pom = _find_file(root, "pom.xml")
                    if pom:
                        content = pom.read_text(
                            encoding="utf-8",
                            errors="ignore",
                        ).lower()

                        if "spring-boot" in content:
                            return "Spring Boot"
                except Exception:
                    pass

            return "Java"

        if language_id == "csharp":
            return ".NET"

        if language_id == "go":
            return "Go"

        if language_id == "rust":
            return "Rust"

        if language_id == "php":
            return "PHP"

        if language_id == "kotlin":
            return "Kotlin"

        if language_id == "cpp":
            return "C++"

        if language_id == "c":
            return "C"

        return "Unknown"

    package_json = _find_package_json(root)

    if not package_json:
        return "Unknown"

    package_data = _read_json(package_json)

    dependencies = {}

    for section in (
        "dependencies",
        "devDependencies",
        "peerDependencies",
        "optionalDependencies",
    ):
        section_data = package_data.get(section, {})

        if isinstance(section_data, dict):
            dependencies.update(section_data)

    dependency_names = set(dependencies.keys())

    # Next.js must be checked before React because
    # Next.js projects normally also contain React.
    if "next" in dependency_names:
        return "Next.js"

    if "@nestjs/core" in dependency_names:
        return "NestJS"

    if "express" in dependency_names:
        return "Express"

    if "react" in dependency_names:
        return "React"

    if "react-dom" in dependency_names:
        return "React"

    if "vue" in dependency_names:
        return "Vue.js"

    if "@angular/core" in dependency_names:
        return "Angular"

    if "svelte" in dependency_names:
        return "Svelte"

    if "vite" in dependency_names:
        return "Vite"

    if "astro" in dependency_names:
        return "Astro"

    if "electron" in dependency_names:
        return "Electron"

    return "Node.js"


def _detect_package_manager(
    root: Path,
    project_path: Path | None = None,
) -> str:
    """
    Detect package manager based primarily on lockfiles.

    Priority:
        package-lock.json -> npm
        bun.lock / bun.lockb -> bun
        pnpm-lock.yaml -> pnpm
        yarn.lock -> yarn
        package.json -> npm
    """

    search_root = project_path if project_path and project_path.exists() else root

    # npm lockfile has priority for this project because the repository
    # contains package-lock.json and it is the deterministic installer.
    if (search_root / "package-lock.json").is_file():
        return "npm"

    if (search_root / "bun.lock").is_file():
        return "bun"

    if (search_root / "bun.lockb").is_file():
        return "bun"

    if (search_root / "pnpm-lock.yaml").is_file():
        return "pnpm"

    if (search_root / "yarn.lock").is_file():
        return "yarn"

    if (search_root / "package.json").is_file():
        return "npm"

    # Fallback: search recursively.
    if _find_file(search_root, "package-lock.json"):
        return "npm"

    if _find_file(search_root, "bun.lock"):
        return "bun"

    if _find_file(search_root, "bun.lockb"):
        return "bun"

    if _find_file(search_root, "pnpm-lock.yaml"):
        return "pnpm"

    if _find_file(search_root, "yarn.lock"):
        return "yarn"

    if _find_file(search_root, "package.json"):
        return "npm"

    return "npm"


def _detect_build_system(
    root: Path,
    language_id: str,
    project_path: Path | None = None,
) -> str:
    """
    Detect build system used by the project.
    """

    project_root = project_path if project_path else root

    if language_id in {"javascript", "typescript"}:
        package_json = project_root / "package.json"

        if not package_json.is_file():
            package_json = _find_package_json(root)

        if package_json:
            package_data = _read_json(package_json)
            scripts = package_data.get("scripts", {})

            if isinstance(scripts, dict):
                if "build" in scripts:
                    return "npm scripts"

                if "compile" in scripts:
                    return "npm scripts"

                if "dev" in scripts:
                    return "npm scripts"

            return "npm scripts"

        return "node"

    if language_id == "python":
        if (project_root / "pyproject.toml").is_file():
            return "pyproject"

        if (project_root / "requirements.txt").is_file():
            return "pip"

        return "python"

    if language_id == "java":
        if (project_root / "pom.xml").is_file():
            return "Maven"

        if (
            (project_root / "build.gradle").is_file()
            or (project_root / "build.gradle.kts").is_file()
        ):
            return "Gradle"

        return "javac"

    if language_id == "c":
        if (project_root / "CMakeLists.txt").is_file():
            return "CMake"

        if (project_root / "Makefile").is_file():
            return "Make"

        return "gcc"

    if language_id == "cpp":
        if (project_root / "CMakeLists.txt").is_file():
            return "CMake"

        if (project_root / "Makefile").is_file():
            return "Make"

        return "g++"

    if language_id == "csharp":
        if _find_extension(project_root, ".sln"):
            return ".NET"

        if _find_extension(project_root, ".csproj"):
            return ".NET"

        return "dotnet"

    if language_id == "go":
        if (project_root / "go.mod").is_file():
            return "Go Modules"

        return "go"

    if language_id == "rust":
        if (project_root / "Cargo.toml").is_file():
            return "Cargo"

        return "rustc"

    if language_id == "php":
        if (project_root / "composer.json").is_file():
            return "Composer"

        return "PHP"

    if language_id == "kotlin":
        if (
            (project_root / "build.gradle").is_file()
            or (project_root / "build.gradle.kts").is_file()
        ):
            return "Gradle"

        return "kotlinc"

    return "Unknown"


def _find_project_path(root: Path, language_id: str) -> Path:
    """
    Find the actual project directory.

    For Node/Next.js repositories, prefer frontend/client/web/app
    directories before falling back to the repository root.
    """

    if language_id in {"javascript", "typescript"}:

        # Preferred frontend directories.
        for directory in PREFERRED_PROJECT_DIRECTORIES:
            candidate = root / directory

            if (candidate / "package.json").is_file():
                return candidate

        # Root package.json.
        if (root / "package.json").is_file():
            return root

        # Recursive search.
        package_json = _find_package_json(root)

        if package_json:
            return package_json.parent

    return root


def detect_project_language(root_path: str | Path) -> str:
    """
    Return only the human-readable programming language.

    Example:
        TypeScript
    """

    root = Path(root_path).resolve()

    if not root.exists():
        return "Unknown"

    # package.json gets special handling.
    package_json = _find_package_json(root)

    if package_json:
        language_id = _detect_node_language(package_json)
        return LANGUAGE_NAMES.get(language_id, "Unknown")

    language_id = _detect_from_extensions(root)

    return LANGUAGE_NAMES.get(language_id, "Unknown")


def detect_project_details(root_path: str | Path) -> dict[str, Any]:
    """
    Return complete project metadata for ACR_AGENT.

    This structured result is consumed by RepoPrepAgent and AnalysisAgent.
    """

    root = Path(root_path).resolve()

    if not root.exists():
        return {
            "status": "FAILED",
            "language_id": "unknown",
            "language": "Unknown",
            "framework": "Unknown",
            "package_manager": None,
            "build_system": None,
            "project_path": str(root),
            "error": f"Project path does not exist: {root}",
        }

    # --------------------------------------------------------
    # Detect language
    # --------------------------------------------------------

    package_json = _find_package_json(root)

    if package_json:
        language_id = _detect_node_language(package_json)
    else:
        language_id = _detect_from_extensions(root)

    language = LANGUAGE_NAMES.get(language_id, "Unknown")

    # --------------------------------------------------------
    # Detect actual project directory
    # --------------------------------------------------------

    project_path = _find_project_path(root, language_id)

    # --------------------------------------------------------
    # Detect framework
    # --------------------------------------------------------

    framework = _detect_framework(root, language_id)

    # --------------------------------------------------------
    # Detect package manager
    # --------------------------------------------------------

    package_manager = None

    if language_id in {"javascript", "typescript"}:
        package_manager = _detect_package_manager(
            root,
            project_path,
        )

    elif language_id == "python":
        package_manager = "pip"

    elif language_id == "java":
        if (project_path / "pom.xml").is_file():
            package_manager = "maven"
        elif (
            (project_path / "build.gradle").is_file()
            or (project_path / "build.gradle.kts").is_file()
        ):
            package_manager = "gradle"

    elif language_id == "csharp":
        package_manager = "dotnet"

    elif language_id == "go":
        package_manager = "go modules"

    elif language_id == "rust":
        package_manager = "cargo"

    elif language_id == "php":
        package_manager = "composer"

    elif language_id == "kotlin":
        package_manager = "gradle"

    # --------------------------------------------------------
    # Detect build system
    # --------------------------------------------------------

    build_system = _detect_build_system(
        root,
        language_id,
        project_path,
    )

    # --------------------------------------------------------
    # Collect important project files
    # --------------------------------------------------------

    marker_files: list[str] = []

    for marker in PROJECT_MARKERS:
        candidate = project_path / marker

        if candidate.is_file():
            marker_files.append(marker)

    marker_files.sort()

    # --------------------------------------------------------
    # Return structured information
    # --------------------------------------------------------

    return {
        "status": "SUCCESS",
        "language_id": language_id,
        "language": language,
        "framework": framework,
        "package_manager": package_manager,
        "build_system": build_system,
        "project_path": str(project_path),
        "repository_path": str(root),
        "marker_files": marker_files,
    }


# ============================================================
# Command-line test
# ============================================================

if __name__ == "__main__":
    import argparse

    parser = argparse.ArgumentParser(
        description="Detect project language, framework and build system."
    )

    parser.add_argument(
        "path",
        nargs="?",
        default=".",
        help="Project/repository path",
    )

    args = parser.parse_args()

    result = detect_project_details(args.path)

    print(json.dumps(result, indent=2))