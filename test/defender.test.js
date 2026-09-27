import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { normalize, format, parameters } from "../lib/defender.js";

describe("defender", () => {
  it("normalises the antivirus block", () => {
    const v = normalize({ antivirus: { realTime: true, sigAge: 0, sigVersion: "1.2", quickScanAge: 0 } });
    assert.equal(v.antivirus.realTime, true);
    assert.equal(v.antivirus.sigVersion, "1.2");
  });
  it("keeps antivirus null when the cmdlet was unavailable", () => {
    assert.equal(normalize({}).antivirus, null);
  });
  it("reports firewall profiles individually", () => {
    const out = format(normalize({ firewall: [{ profile: "Domain", enabled: true }, { profile: "Public", enabled: false }] }));
    assert.match(out, /firewall Domain: on/);
    assert.match(out, /firewall Public: OFF/);
  });
  it("says so when antivirus is unavailable instead of implying it is off", () => {
    assert.match(format(normalize({})), /antivirus: unavailable/);
  });
});
