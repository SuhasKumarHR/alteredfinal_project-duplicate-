import subprocess
import shutil
import json
import os
from pathlib import Path


class AnalysisAgent:
    """
    Analyzes a detected project and validates whether it can be built,
    compiled, or otherwise checked successfully.

    Supported:
        - JavaScript
        - TypeScript
        - Next.js
        - React/Vite-style npm projects
        - Python
        - Java/Maven/Gradle
        - Go
        - Rust
        - PHP
        - C/C++
        - C#
    """

    def __init__(self, repo_path, environment):
        self.repo_path = Path(repo_path).resolve()
        self.environment = environment or {}

    # ============================================================
    # MAIN EXECUTION
    # ============================================================

    def execute(self):
        print("--- [AGENT START]: AnalysisAgent ---")

        language_id = self._detect_language_id()
        project_path = self._resolve_project_path()
        framework = self._get_framework()
        package_manager = self._get_package_manager()

        print(f"[LOG] Language: {language_id}")
        print(f"[LOG] Project path: {project_path}")

        if framework:
            print(f"[LOG] Framework: {framework}")

        if package_manager:
            print(f"[LOG] Package manager: {package_manager}")

        try:
            if language_id in ("javascript", "typescript"):
                result = self._check_js_build(
                    project_path,
                    language_id,
                    package_manager,
                )

            elif language_id == "python":
                result = self._check_python_compilation(project_path)

            elif language_id == "java":
                result = self._check_java_build(project_path)

            elif language_id == "go":
                result = self._check_go(project_path)

            elif language_id == "rust":
                result = self._check_rust(project_path)

            elif language_id == "php":
                result = self._check_php(project_path)

            elif language_id in ("c", "cpp"):
                result = self._check_c_cpp(project_path, language_id)

            elif language_id == "csharp":
                result = self._check_csharp(project_path)

            else:
                result = self._check_unknown(project_path)

        except Exception as exc:
            result = {
                "status": "FAILURE",
                "success": False,
                "error_type": "analysis_exception",
                "error": str(exc),
                "language": language_id,
                "project_path": str(project_path),
            }

        print("--- [AGENT END]: AnalysisAgent ---")
        return result

    # ============================================================
    # LANGUAGE DETECTION
    # ============================================================

    def _detect_language_id(self):
        value = self.environment.get("language_id")

        if value:
            return self._normalize_language(value)

        value = self.environment.get("language")

        if value:
            return self._normalize_language(value)

        project_path = self._resolve_project_path()

        if list(project_path.rglob("*.py")):
            return "python"

        if list(project_path.rglob("*.ts")) or list(project_path.rglob("*.tsx")):
            return "typescript"

        if list(project_path.rglob("*.js")) or list(project_path.rglob("*.jsx")):
            return "javascript"

        if list(project_path.rglob("*.java")):
            return "java"

        if list(project_path.rglob("*.go")):
            return "go"

        if list(project_path.rglob("*.rs")):
            return "rust"

        if list(project_path.rglob("*.php")):
            return "php"

        if list(project_path.rglob("*.cs")):
            return "csharp"

        if list(project_path.rglob("*.cpp")) or list(project_path.rglob("*.cc")):
            return "cpp"

        if list(project_path.rglob("*.c")):
            return "c"

        return "unknown"

    def _normalize_language(self, language):
        value = str(language).strip().lower()

        aliases = {
            "ts": "typescript",
            "typescript": "typescript",
            "tsx": "typescript",

            "js": "javascript",
            "javascript": "javascript",
            "jsx": "javascript",

            "py": "python",
            "python": "python",

            "java": "java",

            "golang": "go",
            "go": "go",

            "rs": "rust",
            "rust": "rust",

            "php": "php",

            "c++": "cpp",
            "cpp": "cpp",
            "cxx": "cpp",

            "c": "c",

            "c#": "csharp",
            "cs": "csharp",
            "csharp": "csharp",
        }

        return aliases.get(value, value)

    # ============================================================
    # PROJECT PATH
    # ============================================================

    def _resolve_project_path(self):
        env_project_path = self.environment.get("project_path")

        if env_project_path:
            candidate = Path(env_project_path)

            if candidate.exists():
                return candidate.resolve()

        relative_project_path = self.environment.get(
            "relative_project_path"
        )

        if relative_project_path:
            candidate = self.repo_path / relative_project_path

            if candidate.exists():
                return candidate.resolve()

        package_candidates = []

        for package_file in self.repo_path.rglob("package.json"):
            if "node_modules" in package_file.parts:
                continue

            package_candidates.append(package_file.parent)

        if package_candidates:
            preferred_names = (
                "frontend",
                "client",
                "web",
                "app",
                "website",
                "ui",
            )

            for preferred in preferred_names:
                for candidate in package_candidates:
                    if candidate.name.lower() == preferred:
                        return candidate.resolve()

            return package_candidates[0].resolve()

        return self.repo_path

    # ============================================================
    # FRAMEWORK
    # ============================================================

    def _get_framework(self):
        framework = self.environment.get("framework")

        if framework:
            return str(framework)

        project_path = self._resolve_project_path()
        package_json = project_path / "package.json"

        if not package_json.exists():
            return ""

        try:
            data = json.loads(
                package_json.read_text(
                    encoding="utf-8",
                    errors="ignore",
                )
            )

            dependencies = {}

            dependencies.update(
                data.get("dependencies", {}) or {}
            )

            dependencies.update(
                data.get("devDependencies", {}) or {}
            )

            if "next" in dependencies:
                return "Next.js"

            if "react" in dependencies:
                return "React"

            if "vite" in dependencies:
                return "Vite"

            if "express" in dependencies:
                return "Express"

        except Exception:
            pass

        return ""

    # ============================================================
    # PACKAGE MANAGER
    # ============================================================

    def _get_package_manager(self):
        explicit = self.environment.get("package_manager")

        if explicit:
            return str(explicit).lower()

        project_path = self._resolve_project_path()

        if (project_path / "package-lock.json").exists():
            return "npm"

        if (project_path / "pnpm-lock.yaml").exists():
            return "pnpm"

        if (project_path / "yarn.lock").exists():
            return "yarn"

        if (
            (project_path / "bun.lock").exists()
            or (project_path / "bun.lockb").exists()
        ):
            return "bun"

        return "npm"

    # ============================================================
    # WINDOWS COMMAND RESOLUTION
    # ============================================================

    def _resolve_command(self, command):
        """
        Resolves executable names correctly on Windows.

        PowerShell can execute:
            npm

        but subprocess.run(..., shell=False) may need:
            npm.cmd
        """

        if not command:
            return command

        command = str(command)

        # If an absolute path already exists, keep it.
        if os.path.isabs(command):
            if os.path.exists(command):
                return command

        # Windows command resolution.
        if os.name == "nt":
            windows_commands = {
                "npm": "npm.cmd",
                "npx": "npx.cmd",
                "pnpm": "pnpm.cmd",
                "yarn": "yarn.cmd",
                "bun": "bun.exe",
                "python": "python.exe",
                "pip": "pip.exe",
                "mvn": "mvn.cmd",
                "gradle": "gradle.bat",
                "cargo": "cargo.exe",
                "rustc": "rustc.exe",
                "go": "go.exe",
                "php": "php.exe",
                "dotnet": "dotnet.exe",
                "gcc": "gcc.exe",
                "g++": "g++.exe",
                "cmake": "cmake.exe",
                "javac": "javac.exe",
                "java": "java.exe",
            }

            resolved_name = windows_commands.get(
                command.lower(),
                command,
            )

            found = shutil.which(resolved_name)

            if found:
                return found

            # Try original command as final fallback.
            found = shutil.which(command)

            if found:
                return found

            return resolved_name

        # Linux / macOS / Docker.
        found = shutil.which(command)

        if found:
            return found

        return command

    def _prepare_command(self, command):
        if not command:
            return command

        prepared = list(command)

        prepared[0] = self._resolve_command(
            prepared[0]
        )

        return prepared

    # ============================================================
    # COMMAND RUNNER
    # ============================================================

    def _run_command(
        self,
        command,
        cwd,
        timeout=900,
    ):
        command = self._prepare_command(command)

        print(
            f"[COMMAND] {' '.join(str(x) for x in command)}"
        )

        try:
            process = subprocess.run(
                command,
                cwd=str(cwd),
                capture_output=True,
                text=True,
                timeout=timeout,
                shell=False,
            )

            stdout = process.stdout or ""
            stderr = process.stderr or ""

            if stdout.strip():
                print(stdout.rstrip())

            if stderr.strip():
                print(stderr.rstrip())

            return {
                "success": process.returncode == 0,
                "return_code": process.returncode,
                "stdout": stdout,
                "stderr": stderr,
                "command": command,
            }

        except subprocess.TimeoutExpired as exc:
            stdout = exc.stdout or ""
            stderr = exc.stderr or ""

            if isinstance(stdout, bytes):
                stdout = stdout.decode(
                    "utf-8",
                    errors="replace",
                )

            if isinstance(stderr, bytes):
                stderr = stderr.decode(
                    "utf-8",
                    errors="replace",
                )

            return {
                "success": False,
                "return_code": None,
                "stdout": stdout,
                "stderr": stderr,
                "command": command,
                "timeout": True,
            }

        except FileNotFoundError as exc:
            return {
                "success": False,
                "return_code": None,
                "stdout": "",
                "stderr": str(exc),
                "command": command,
                "error": "command_not_found",
            }

        except Exception as exc:
            return {
                "success": False,
                "return_code": None,
                "stdout": "",
                "stderr": str(exc),
                "command": command,
                "error": "command_execution_error",
            }

    # ============================================================
    # JAVASCRIPT / TYPESCRIPT
    # ============================================================

    def _check_js_build(
        self,
        project_path,
        language_id,
        package_manager,
    ):
        package_json = project_path / "package.json"

        if not package_json.exists():
            return {
                "status": "FAILURE",
                "success": False,
                "error_type": "missing_package_json",
                "error": "package.json was not found",
                "project_path": str(project_path),
            }

        try:
            package_data = json.loads(
                package_json.read_text(
                    encoding="utf-8",
                    errors="ignore",
                )
            )
        except Exception as exc:
            return {
                "status": "FAILURE",
                "success": False,
                "error_type": "invalid_package_json",
                "error": str(exc),
                "project_path": str(project_path),
            }

        scripts = package_data.get(
            "scripts",
            {}
        ) or {}

        # --------------------------------------------------------
        # INSTALL DEPENDENCIES
        # --------------------------------------------------------

        node_modules = project_path / "node_modules"

        if not node_modules.exists():
            install_command = self._get_install_command(
                project_path,
                package_manager,
            )

            install_result = self._run_command(
                install_command,
                project_path,
                timeout=1200,
            )

            if not install_result["success"]:
                return {
                    "status": "FAILURE",
                    "success": False,
                    "error_type": "dependency_installation_error",
                    "error": self._format_command_error(
                        install_result
                    ),
                    "command": install_result["command"],
                    "return_code": install_result["return_code"],
                    "stdout": install_result["stdout"],
                    "stderr": install_result["stderr"],
                    "project_path": str(project_path),
                }

        # --------------------------------------------------------
        # BUILD SCRIPT
        # --------------------------------------------------------

        build_script = None

        if "build" in scripts:
            build_script = "build"

        elif "compile" in scripts:
            build_script = "compile"

        # --------------------------------------------------------
        # RUN BUILD
        # --------------------------------------------------------

        if build_script:
            build_result = self._run_command(
                [
                    package_manager,
                    "run",
                    build_script,
                ],
                project_path,
                timeout=1800,
            )

            if not build_result["success"]:
                return {
                    "status": "FAILURE",
                    "success": False,
                    "error_type": "build_error",
                    "error": self._format_command_error(
                        build_result
                    ),
                    "command": build_result["command"],
                    "return_code": build_result["return_code"],
                    "stdout": build_result["stdout"],
                    "stderr": build_result["stderr"],
                    "project_path": str(project_path),
                }

        # --------------------------------------------------------
        # TYPESCRIPT CHECK
        # --------------------------------------------------------

        if language_id == "typescript":

            if "typecheck" in scripts:
                typecheck_result = self._run_command(
                    [
                        package_manager,
                        "run",
                        "typecheck",
                    ],
                    project_path,
                    timeout=1200,
                )

                if not typecheck_result["success"]:
                    return {
                        "status": "FAILURE",
                        "success": False,
                        "error_type": "typescript_error",
                        "error": self._format_command_error(
                            typecheck_result
                        ),
                        "command": typecheck_result["command"],
                        "return_code": typecheck_result["return_code"],
                        "stdout": typecheck_result["stdout"],
                        "stderr": typecheck_result["stderr"],
                        "project_path": str(project_path),
                    }

            elif not build_script:
                tsc_path = shutil.which(
                    "tsc"
                )

                if tsc_path:
                    typecheck_result = self._run_command(
                        [
                            tsc_path,
                            "--noEmit",
                        ],
                        project_path,
                        timeout=1200,
                    )

                    if not typecheck_result["success"]:
                        return {
                            "status": "FAILURE",
                            "success": False,
                            "error_type": "typescript_error",
                            "error": self._format_command_error(
                                typecheck_result
                            ),
                            "command": typecheck_result["command"],
                            "return_code": typecheck_result["return_code"],
                            "stdout": typecheck_result["stdout"],
                            "stderr": typecheck_result["stderr"],
                            "project_path": str(project_path),
                        }

        return {
            "status": "SUCCESS",
            "success": True,
            "error_type": None,
            "error": None,
            "language": language_id,
            "framework": self._get_framework(),
            "package_manager": package_manager,
            "project_path": str(project_path),
            "build_script": build_script,
        }

    def _get_install_command(
        self,
        project_path,
        package_manager,
    ):
        if package_manager == "npm":
            package_lock = (
                project_path /
                "package-lock.json"
            )

            if package_lock.exists():
                return [
                    "npm",
                    "ci",
                ]

            return [
                "npm",
                "install",
            ]

        if package_manager == "pnpm":
            return [
                "pnpm",
                "install",
                "--frozen-lockfile",
            ]

        if package_manager == "yarn":
            return [
                "yarn",
                "install",
                "--frozen-lockfile",
            ]

        if package_manager == "bun":
            return [
                "bun",
                "install",
                "--frozen-lockfile",
            ]

        return [
            "npm",
            "install",
        ]

    def _format_command_error(self, result):
        parts = []

        return_code = result.get(
            "return_code"
        )

        if return_code is not None:
            parts.append(
                f"Process exited with code {return_code}"
            )

        stderr = result.get(
            "stderr",
            ""
        ).strip()

        stdout = result.get(
            "stdout",
            ""
        ).strip()

        if stderr:
            parts.append(
                f"STDERR:\n{stderr[-8000:]}"
            )

        if stdout:
            parts.append(
                f"STDOUT:\n{stdout[-8000:]}"
            )

        if result.get("timeout"):
            parts.append(
                "Command timed out."
            )

        if result.get("error"):
            parts.append(
                f"Execution error: {result['error']}"
            )

        return "\n\n".join(parts)

    # ============================================================
    # PYTHON
    # ============================================================

    def _check_python_compilation(
        self,
        project_path,
    ):
        python_files = [
            path
            for path in project_path.rglob("*.py")
            if "venv" not in path.parts
            and ".venv" not in path.parts
            and "__pycache__" not in path.parts
        ]

        if not python_files:
            return {
                "status": "SUCCESS",
                "success": True,
                "error_type": None,
                "error": None,
                "message": "No Python files found.",
            }

        for python_file in python_files:
            result = self._run_command(
                [
                    "python",
                    "-m",
                    "py_compile",
                    str(python_file),
                ],
                self.repo_path,
                timeout=300,
            )

            if not result["success"]:
                return {
                    "status": "FAILURE",
                    "success": False,
                    "error_type": "python_compilation_error",
                    "error": self._format_command_error(
                        result
                    ),
                    "file": str(python_file),
                }

        return {
            "status": "SUCCESS",
            "success": True,
            "error_type": None,
            "error": None,
            "files_checked": len(python_files),
        }

    # ============================================================
    # JAVA
    # ============================================================

    def _check_java_build(
        self,
        project_path,
    ):
        pom_file = project_path / "pom.xml"

        if pom_file.exists():
            result = self._run_command(
                [
                    "mvn",
                    "test",
                    "-DskipTests",
                ],
                project_path,
                timeout=1800,
            )

            if not result["success"]:
                return {
                    "status": "FAILURE",
                    "success": False,
                    "error_type": "java_build_error",
                    "error": self._format_command_error(
                        result
                    ),
                }

            return {
                "status": "SUCCESS",
                "success": True,
                "error_type": None,
                "error": None,
                "build_system": "Maven",
            }

        gradle_files = [
            project_path / "gradlew",
            project_path / "gradlew.bat",
            project_path / "build.gradle",
            project_path / "build.gradle.kts",
        ]

        if any(
            path.exists()
            for path in gradle_files
        ):
            gradle_command = "gradlew.bat"

            if not (
                project_path /
                "gradlew.bat"
            ).exists():
                gradle_command = "gradle"

            result = self._run_command(
                [
                    gradle_command,
                    "build",
                    "-x",
                    "test",
                ],
                project_path,
                timeout=1800,
            )

            if not result["success"]:
                return {
                    "status": "FAILURE",
                    "success": False,
                    "error_type": "java_build_error",
                    "error": self._format_command_error(
                        result
                    ),
                }

            return {
                "status": "SUCCESS",
                "success": True,
                "error_type": None,
                "error": None,
                "build_system": "Gradle",
            }

        java_files = list(
            project_path.rglob("*.java")
        )

        if not java_files:
            return {
                "status": "FAILURE",
                "success": False,
                "error_type": "java_files_not_found",
                "error": "No Java source files found.",
            }

        result = self._run_command(
            [
                "javac",
                *[
                    str(path)
                    for path in java_files
                ],
            ],
            project_path,
            timeout=900,
        )

        if not result["success"]:
            return {
                "status": "FAILURE",
                "success": False,
                "error_type": "java_compilation_error",
                "error": self._format_command_error(
                    result
                ),
            }

        return {
            "status": "SUCCESS",
            "success": True,
            "error_type": None,
            "error": None,
            "build_system": "javac",
        }

    # ============================================================
    # GO
    # ============================================================

    def _check_go(
        self,
        project_path,
    ):
        go_mod = project_path / "go.mod"

        if not go_mod.exists():
            return {
                "status": "FAILURE",
                "success": False,
                "error_type": "go_module_missing",
                "error": "go.mod not found.",
            }

        result = self._run_command(
            [
                "go",
                "build",
                "./...",
            ],
            project_path,
            timeout=1200,
        )

        if not result["success"]:
            return {
                "status": "FAILURE",
                "success": False,
                "error_type": "go_build_error",
                "error": self._format_command_error(
                    result
                ),
            }

        return {
            "status": "SUCCESS",
            "success": True,
            "error_type": None,
            "error": None,
        }

    # ============================================================
    # RUST
    # ============================================================

    def _check_rust(
        self,
        project_path,
    ):
        cargo_file = (
            project_path /
            "Cargo.toml"
        )

        if not cargo_file.exists():
            return {
                "status": "FAILURE",
                "success": False,
                "error_type": "cargo_manifest_missing",
                "error": "Cargo.toml not found.",
            }

        result = self._run_command(
            [
                "cargo",
                "check",
            ],
            project_path,
            timeout=1200,
        )

        if not result["success"]:
            return {
                "status": "FAILURE",
                "success": False,
                "error_type": "rust_build_error",
                "error": self._format_command_error(
                    result
                ),
            }

        return {
            "status": "SUCCESS",
            "success": True,
            "error_type": None,
            "error": None,
        }

    # ============================================================
    # PHP
    # ============================================================

    def _check_php(
        self,
        project_path,
    ):
        php_files = list(
            project_path.rglob("*.php")
        )

        if not php_files:
            return {
                "status": "FAILURE",
                "success": False,
                "error_type": "php_files_not_found",
                "error": "No PHP files found.",
            }

        for php_file in php_files:
            result = self._run_command(
                [
                    "php",
                    "-l",
                    str(php_file),
                ],
                project_path,
                timeout=300,
            )

            if not result["success"]:
                return {
                    "status": "FAILURE",
                    "success": False,
                    "error_type": "php_syntax_error",
                    "error": self._format_command_error(
                        result
                    ),
                    "file": str(php_file),
                }

        return {
            "status": "SUCCESS",
            "success": True,
            "error_type": None,
            "error": None,
            "files_checked": len(php_files),
        }

    # ============================================================
    # C / C++
    # ============================================================

    def _check_c_cpp(
        self,
        project_path,
        language_id,
    ):
        cmake_file = (
            project_path /
            "CMakeLists.txt"
        )

        if cmake_file.exists():
            build_dir = (
                project_path /
                ".acr_build"
            )

            configure_result = self._run_command(
                [
                    "cmake",
                    "-S",
                    str(project_path),
                    "-B",
                    str(build_dir),
                ],
                project_path,
                timeout=1200,
            )

            if not configure_result["success"]:
                return {
                    "status": "FAILURE",
                    "success": False,
                    "error_type": "cmake_configuration_error",
                    "error": self._format_command_error(
                        configure_result
                    ),
                }

            build_result = self._run_command(
                [
                    "cmake",
                    "--build",
                    str(build_dir),
                ],
                project_path,
                timeout=1200,
            )

            if not build_result["success"]:
                return {
                    "status": "FAILURE",
                    "success": False,
                    "error_type": "cpp_build_error",
                    "error": self._format_command_error(
                        build_result
                    ),
                }

            return {
                "status": "SUCCESS",
                "success": True,
                "error_type": None,
                "error": None,
                "build_system": "CMake",
            }

        extension = (
            "*.cpp"
            if language_id == "cpp"
            else "*.c"
        )

        source_files = list(
            project_path.rglob(extension)
        )

        if not source_files:
            return {
                "status": "FAILURE",
                "success": False,
                "error_type": "source_files_not_found",
                "error": (
                    f"No {language_id} "
                    "source files found."
                ),
            }

        compiler = (
            "g++"
            if language_id == "cpp"
            else "gcc"
        )

        output_file = (
            project_path /
            ".acr_build_output"
        )

        result = self._run_command(
            [
                compiler,
                *[
                    str(path)
                    for path in source_files
                ],
                "-o",
                str(output_file),
            ],
            project_path,
            timeout=900,
        )

        if not result["success"]:
            return {
                "status": "FAILURE",
                "success": False,
                "error_type": (
                    f"{language_id}_"
                    "compilation_error"
                ),
                "error": self._format_command_error(
                    result
                ),
            }

        return {
            "status": "SUCCESS",
            "success": True,
            "error_type": None,
            "error": None,
            "compiler": compiler,
        }

    # ============================================================
    # C#
    # ============================================================

    def _check_csharp(
        self,
        project_path,
    ):
        project_files = list(
            project_path.rglob("*.csproj")
        )

        if not project_files:
            return {
                "status": "FAILURE",
                "success": False,
                "error_type": "csharp_project_missing",
                "error": "No .csproj file found.",
            }

        result = self._run_command(
            [
                "dotnet",
                "build",
                "--no-restore",
            ],
            project_path,
            timeout=1800,
        )

        if not result["success"]:
            return {
                "status": "FAILURE",
                "success": False,
                "error_type": "csharp_build_error",
                "error": self._format_command_error(
                    result
                ),
            }

        return {
            "status": "SUCCESS",
            "success": True,
            "error_type": None,
            "error": None,
        }

    # ============================================================
    # UNKNOWN
    # ============================================================

    def _check_unknown(
        self,
        project_path,
    ):
        files = [
            path
            for path in project_path.rglob("*")
            if path.is_file()
            and "node_modules" not in path.parts
            and ".git" not in path.parts
            and "__pycache__" not in path.parts
        ]

        if not files:
            return {
                "status": "FAILURE",
                "success": False,
                "error_type": "empty_project",
                "error": "No project files found.",
            }

        return {
            "status": "SUCCESS",
            "success": True,
            "error_type": None,
            "error": None,
            "message": (
                "Project detected but no "
                "specialized build system "
                "was identified."
            ),
        }