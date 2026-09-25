import { describe, it, expect } from "vitest";

interface AccessMatrixItem {
  userId: string;
  caseId: string;
  hasAccess: boolean;
}

// Function modeling the unoptimized O(N*M*K) logic
function unoptimizedUpdateAccess(
  accessMatrix: AccessMatrixItem[],
  selectedUsers: Array<{ id: string }>,
  selectedCases: Array<{ id: string }>,
  grantAccess: boolean
): AccessMatrixItem[] {
  const updatedMatrix = [...accessMatrix];

  selectedUsers.forEach((user) => {
    selectedCases.forEach((caseItem) => {
      const existingItemIndex = updatedMatrix.findIndex(
        (item) => item.userId === user.id && item.caseId === caseItem.id
      );

      if (existingItemIndex >= 0) {
        updatedMatrix[existingItemIndex].hasAccess = grantAccess;
      } else {
        updatedMatrix.push({
          userId: user.id,
          caseId: caseItem.id,
          hasAccess: grantAccess,
        });
      }
    });
  });

  return updatedMatrix;
}

// Function modeling the optimized O(K + N*M) Map-based logic
function optimizedUpdateAccess(
  accessMatrix: AccessMatrixItem[],
  selectedUsers: Array<{ id: string }>,
  selectedCases: Array<{ id: string }>,
  grantAccess: boolean
): AccessMatrixItem[] {
  const updatedMatrix = [...accessMatrix];
  const indexMap = new Map<string, number>();

  updatedMatrix.forEach((item, index) => {
    indexMap.set(`${item.userId}_${item.caseId}`, index);
  });

  selectedUsers.forEach((user) => {
    selectedCases.forEach((caseItem) => {
      const key = `${user.id}_${caseItem.id}`;
      const existingItemIndex = indexMap.get(key);

      if (existingItemIndex !== undefined) {
        updatedMatrix[existingItemIndex].hasAccess = grantAccess;
      } else {
        const newIndex =
          updatedMatrix.push({
            userId: user.id,
            caseId: caseItem.id,
            hasAccess: grantAccess,
          }) - 1;
        indexMap.set(key, newIndex);
      }
    });
  });

  return updatedMatrix;
}

describe("CaseAccessControl Update Matrix Logic", () => {
  it("should match correctness between unoptimized and optimized versions for existing & new entries", () => {
    const initialMatrix: AccessMatrixItem[] = [
      { userId: "1", caseId: "C-2023-001", hasAccess: true },
      { userId: "2", caseId: "C-2023-001", hasAccess: true },
      { userId: "2", caseId: "C-2023-002", hasAccess: true },
    ];

    const selectedUsers = [{ id: "2" }, { id: "3" }];
    const selectedCases = [{ id: "C-2023-001" }, { id: "C-2023-003" }];

    const res1 = unoptimizedUpdateAccess(initialMatrix, selectedUsers, selectedCases, false);
    const res2 = optimizedUpdateAccess(initialMatrix, selectedUsers, selectedCases, false);

    expect(res1).toEqual(res2);
  });

  it("should demonstrate significant performance improvement on moderate matrix sizes", () => {
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

    const start1 = performance.now();
    const res1 = unoptimizedUpdateAccess(accessMatrix, selectedUsers, selectedCases, false);
    const end1 = performance.now();
    const durationUnoptimized = end1 - start1;

    const start2 = performance.now();
    const res2 = optimizedUpdateAccess(accessMatrix, selectedUsers, selectedCases, false);
    const end2 = performance.now();
    const durationOptimized = end2 - start2;

    expect(res1).toEqual(res2);
    expect(durationOptimized).toBeLessThan(durationUnoptimized);
  });
});
