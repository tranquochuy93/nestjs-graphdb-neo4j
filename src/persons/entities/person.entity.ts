import { Node } from "neo4j-driver";

export class Person {
    constructor(private readonly node: Node) {}

    getId(): string {
        return (<Record<string, any>> this.node.properties).id
    }

    getName(): string {
        return (<Record<string, any>> this.node.properties).name
    }

    getNumber(): string {
        return (<Record<string, any>> this.node.properties).number
    }

    getGender(): string {
        return (<Record<string, any>> this.node.properties).gender
    }

    toJson(): Record<string, any> {
        const { name, number, gender, id } = <Record<string, any>> this.node.properties
        return { name, number, gender, id };
    }
}