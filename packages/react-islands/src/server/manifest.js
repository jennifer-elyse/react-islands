import fs from "node:fs";
import { escapeJsonForInlineScript } from "./serialize.js";

export const createManifestProvider = ({
	mode, // "dev" | "prod"
	devModules, // { [moduleSpecifier]: resolvedImportTarget }
	manifestPath, // e.g. "dist/client/islands-manifest.json"
	runtimeDevSrc = "/assets/islands-runtime.js",
}) => {
	if (mode === "dev")
	{
		const manifest = {
			modules: devModules || {},
			"islands-runtime": runtimeDevSrc,
		};

		return {
			mode: "dev",
			getManifest: () => manifest,
			getManifestJson: () => escapeJsonForInlineScript(JSON.stringify(manifest)),
		};
	}

	if (!manifestPath)
	{
		throw new Error("createManifestProvider: manifestPath is required in prod mode");
	}

	const raw = fs.readFileSync(manifestPath, "utf8");
	const manifest = JSON.parse(raw);

	if (!manifest.modules)
	{
		throw new Error("Manifest missing required key: modules");
	}

	return {
		mode: "prod",
		getManifest: () => manifest,
		getManifestJson: () => escapeJsonForInlineScript(JSON.stringify(manifest)),
	};
};
