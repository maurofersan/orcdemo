import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "typeof"
})
export class TypeOfPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    return typeof value;
  }

}

@Pipe({
  name: "instanceof"
})
export class InstanceOfPipe implements PipeTransform {
  transform(value: any, ...args): any {
    return value instanceof args[0];
  }
}
