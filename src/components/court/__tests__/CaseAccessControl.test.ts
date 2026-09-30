import { describe, it, expect } from "vitest";
import { updateAccessMatrix, AccessMatrixItem } from "../CaseAccessControl";

describe("CaseAccessControl Update Matrix Logic", () => {
  it("should correctly grant and revoke access permissions using Map lookup", () => {
    const initialMatrix: AccessMatrixItem[] = [
      { userId: "1", caseId: "C-2023-001", hasAccess: true },
      { userId: "2", caseId: "C-2023-001", hasAccess: true },
      { userId: "2", caseId: "C-2023-002", hasAccess: true },
    ];

    const selectedUsers = [{ id: "2" }, { id: "3" }];
    const selectedCases = [{ id: "C-2023-001" }, { id: "C-2023-003" }];

    const updated = updateAccessMatrix(initialMatrix, selectedUsers, selectedCases, false);

    expect(updated).toEqual([
      { userId: "1", caseId: "C-2023-001", hasAccess: true },
      { userId: "2", caseId: "C-2023-001", hasAccess: false },
      { userId: "2", caseId: "C-2023-002", hasAccess: true },
      { userId: "2", caseId: "C-2023-003", hasAccess: false },
      { userId: "3", caseId: "C-2023-001", hasAccess: false },
      { userId: "3", caseId: "C-2023-003", hasAccess: false },
    ]);
  });

  it("should complete matrix updates for large datasets rapidly", () => {
    const K = 5000;
    const N = 100;
    const M = 100;

    const accessMatrix: AccessMatrixItem[] = Array.from({ length: K }, (_, i) => ({
      userId: `user_${i}`,
      caseId: `case_${i}`,
      hasAccess: true,
    }));

    const selectedUsers = Array.from({ length: N }, (_, i) => ({ id: `user_${i * 2}` }));
    const selectedCases = Array.from({ length: M }, (_, i) => ({ id: `case_${i * 2}` }));

    const start = performance.now();
    const updated = updateAccessMatrix(accessMatrix, selectedUsers, selectedCases, false);
    const duration = performance.now() - start;

    expect(updated.length).toBe(K + N * M - 100); // 100 overlapping items updated in place (user_0/2/.../198 and case_0/2/.../198 intersect for 100 entries: user_2k & case_2k where 0 <= k < 50)
    expect(duration).toBeLessThan(1000);
  });
});
