import {Controller, Get, Path, Route, Security} from "tsoa";
import {HelloWorldService} from "../services/hello-world.service";
import {HelloWorld} from "../interfaces/HelloWorld";

@Route("/")
export class HelloWorldController extends Controller {

    public constructor(private helloWorldService: HelloWorldService = new HelloWorldService()) {
        super();
    }

    @Get("/")
    @Security('BearerAuth')
    public async getAllUser(
    ): Promise<HelloWorld> {
        return this.helloWorldService.get();
    }

    @Get("/:id")
    @Security('BearerAuth')
    public async getUserById(id: string): Promise<string> {
        return id;
    }
}