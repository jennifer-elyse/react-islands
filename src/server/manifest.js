"use server";

import fs from "node:fs";
import { createHash } from "node:crypto";
import { escapeJsonForInlineScript } from "./serialize.js";

/**
 * Creates a manifest provider that the server can use to embed the islands
 * manifest JSON into the HTML. In dev, you supply module URLs directly; in
 * prod, it reads the JSON emitted by your bundler.
 */
export const createManifestProvider = ({
	mode, // "dev" | "prod"
	devModules, // { [moduleSpecifier]: resolvedImportTarget }
	manifestPath, // e.g. "dist/client/islands-manifest.json"
	runtimeDevSrc = "/assets/islands-runtime.js",
	includeIntegrity = true,
	extraManifestFields = {},
}) => {
	const buildPayload = (manifest) => {
		const manifestJson = escapeJsonForInlineScript(JSON.stringify(manifest));

		let manifestIntegrity = null;
		if (includeIntegrity)
		{
			const digest = createHash("sha256").update(manifestJson).digest("base64");
			manifestIntegrity = `sha256-${digest}`;
		}

		return { manifest, manifestJson, manifestIntegrity };
	};

	if (mode === "dev")
	{
		const manifest = {
			modules: devModules || {},
			"islands-runtime": runtimeDevSrc,
			...extraManifestFields,
		};

		const payload = buildPayload(manifest);

		return {
			mode: "dev",
			getManifest: () => payload.manifest,
			getManifestJson: () => payload.manifestJson,
			getManifestIntegrity: () => payload.manifestIntegrity,
		};
	}

	if (!manifestPath)
	{
		throw new Error("createManifestProvider: manifestPath is required in prod mode");
	}

	const raw = fs.readFileSync(manifestPath, "utf8");
	const manifest = { ...JSON.parse(raw), ...extraManifestFields };

	if (!manifest.modules)
	{
		throw new Error("Manifest missing required key: modules");
	}

	const payload = buildPayload(manifest);

	return {
		mode: "prod",
		getManifest: () => payload.manifest,
		getManifestJson: () => payload.manifestJson,
		getManifestIntegrity: () => payload.manifestIntegrity,
	};
};
