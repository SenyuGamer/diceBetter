import * as THREE from "three";

// Set up the dice roll variables ahead of time to avoid re-creating the objects frequently
let meshPosition = new THREE.Vector3();
let locatorVector = new THREE.Vector3();
const up = new THREE.Vector3(0, 1, 0);
let highestDot = -1;
let dot = -1;
let highestNumber = 0;

export function getValueFromDiceGroup(parent: THREE.Group, dieType?: string): { value: number; isCocked: boolean } {
  // Reset the order variables
  highestDot = -1;
  highestNumber = 0;

  const dice = parent.getObjectByName("dice");
  const mesh = dice?.children[0];
  const locators = mesh?.children;
  if (mesh && locators) {
    for (const locator of locators) {
      // Calculate the dot product between the locator direction and the world up vector
      // The highest dot product will be the locator facing the most up.
      mesh.getWorldPosition(meshPosition);
      locator.getWorldPosition(locatorVector);
      locatorVector.sub(meshPosition);
      locatorVector.normalize();
      dot = locatorVector.dot(up);
      if (dot > highestDot) {
        highestDot = dot;
        // Get the locator number by slicing the name and parsing it
        highestNumber = parseInt(locator.name.slice(12));
      }
    }
  }
  // We consider a die cocked if the highest dot product is less than a certain threshold.
  // Standard tolerance is 0.98 (~11 degrees). D10 and D100 are less stable by shape, so we increase their tolerance to 0.95 (~18 degrees).
  const tolerance = (dieType === "D10" || dieType === "D100") ? 0.95 : 0.98;

  return {
    value: highestNumber,
    isCocked: highestDot < tolerance,
  };
}
