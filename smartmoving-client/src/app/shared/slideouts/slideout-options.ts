export class SlideoutOptions {
  width?: string;
  height?: string;
  backdropClass?: string;
  panelClass?: string;
  disableBackdropClick?: boolean;
  additionalContainerClasses?: string;
  popoutOptions?: SlideoutPopoutOptions;
  noPadding?: boolean;
}

export class SlideoutPopoutOptions {
  url: string;
  target?: string;
  features?: string;
}
