import { Injectable, PipeTransform } from "@nestjs/common";
@Injectable()
export class ParseQueryValuePipe implements PipeTransform<string, string[]> {
    transform(value: string | string[]): string[] {
        if (value) {
            return [value].flat();
        }
    }
}