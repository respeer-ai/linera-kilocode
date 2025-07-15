export function rustInstallCommand(): string {
	const platform = process.platform
	const arch = process.arch

	if (platform === "win32") {
		let targetTriple: string

		if (arch === "x64") {
			targetTriple = "x86_64-pc-windows-msvc"
		} else if (arch === "ia32") {
			targetTriple = "i686-pc-windows-msvc"
		} else {
			throw new Error("Unsupported Windows architecture: " + arch)
		}

		return `https://static.rust-lang.org/rustup/dist/${targetTriple}/rustup-init.exe`
	}

	// For Linux, macOS, etc.
	return `curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh`
}
