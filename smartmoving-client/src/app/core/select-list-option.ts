export class SelectListOption {
  id: string;
  name: string;


  static createFor(name: string) {
    const option = new SelectListOption();
    option.id = name;
    option.name = name;

    return option;
  }
}
