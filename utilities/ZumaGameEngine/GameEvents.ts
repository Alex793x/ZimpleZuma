import LinkedList from "@/components/LinkedList/LinkedList";
import LinkedListNode from "@/components/LinkedList/LinkedListNode";
import { generateSuperPower } from "@/types/SuperPower";
import { ZumaBall } from "@/types/ZumaBall";


export const ZumaBallChainEvent = (position: number, shootingBall: ZumaBall, linkedList: LinkedList<ZumaBall>) => {
    // Insert the shooting ball at the specified position
    linkedList.insertBefore(position, shootingBall);

    let chainEventOccurred = false;

    const checkAndRemoveChain = (node: LinkedListNode<ZumaBall> | null) => {
        let count = 1; // Start with the current node
        let currentNode = node;

        // Check previous nodes
        while (currentNode?.prev && currentNode.prev.data.image === node?.data.image) {
            count++;
            currentNode = currentNode.prev;
        }
        let firstNode = currentNode; // Keep track of the first node in the potential chain

        // Reset to the original node to check the next nodes
        currentNode = node;
        while (currentNode?.next && currentNode.next.data.image === node?.data.image) {
            count++;
            currentNode = currentNode.next;
        }

        // If 3 or more consecutive balls are the same, remove them
        if (count >= 3) {
            chainEventOccurred = true;
            for (let i = 0; i < count; i++) {
                const nextNode = firstNode?.next; // Save the next node before removal
                linkedList.removeNode(firstNode!); // Remove the node
                firstNode = nextNode || null; // Move to the next node
            }
        }

        setTimeout(() => {
            checkAndRemoveChain(currentNode);
        }, 800); 
    };

    // Check for chain event starting from the newly inserted ball's node
    const newNode = linkedList.nodeAt(position);
    if (newNode) {
        checkAndRemoveChain(newNode);
        // Optionally, check adjacent nodes if needed, depending on game logic
    }

    // Return whether a chain event occurred
    return chainEventOccurred;
};

export const generateBall = (): ZumaBall => ({
    image: `${Math.floor(Math.random() * 5) + 1}.svg`,
    superPower: generateSuperPower()
});