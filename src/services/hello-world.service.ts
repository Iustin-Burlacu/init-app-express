import { HelloWorld } from "../interfaces/HelloWorld";

export class HelloWorldService {

    public get(): HelloWorld {
        return {
            world: "Hello World"
        }
    }

}