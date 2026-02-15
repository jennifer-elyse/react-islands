import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import assert from "node:assert/strict";
import test from "node:test";

import { createManifestProvider } from "../manifest.js";

const writeTempManifest = (data) => {
	const dir = fs.mkdtempSync(path.join(os.tmpdir(), "manifest-"));
	const file = path.join(dir, "manifest.json");
	fs.writeFileSync(file, JSON.stringify(data), "utf8");
	return { dir, file };
};

test("createManifestProvider (prod) emits integrity and merges extra fields", () => {
	const { file, dir } = writeTempManifest({ modules: { a: "/a.js" } });
	const provider = createManifestProvider({
		mode: "prod",
		manifestPath: file,
		extraManifestFields: { "custom-extra": "/extra.js" },
	});

	const manifest = provider.getManifest();
	assert.equal(manifest["custom-extra"], "/extra.js");
	assert.equal(manifest.modules.a, "/a.js");

	const integrity = provider.getManifestIntegrity();
	assert.ok(typeof integrity === "string" && integrity.startsWith("sha256-"));

	// cleanup
	fs.rmSync(dir, { recursive: true, force: true });
});

test("createManifestProvider (dev) includes runtime and extras", () => {
	const provider = createManifestProvider({
		mode: "dev",
		devModules: { "/x": "http://localhost:5173/x.js" },
		runtimeDevSrc: "http://localhost:5173/runtime.js",
		extraManifestFields: { "custom-extra": "http://localhost:5173/extra.js" },
	});

	const manifest = provider.getManifest();
	assert.equal(manifest.modules["/x"], "http://localhost:5173/x.js");
	assert.equal(manifest["islands-runtime"], "http://localhost:5173/runtime.js");
	assert.equal(manifest["custom-extra"], "http://localhost:5173/extra.js");
});
