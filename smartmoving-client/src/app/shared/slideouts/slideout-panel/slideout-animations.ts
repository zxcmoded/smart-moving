import {
  animate,
  state,
  style,
  transition,
  trigger,
  AnimationTriggerMetadata,
} from '@angular/animations';

export const slideoutAnimations: {
  readonly slideIn: AnimationTriggerMetadata;
} = {
  /** Animation that slides the dialog in and out of view and fades the opacity. */
  slideIn: trigger('slideIn', [
    state('enter', style({ transform: 'translate3d(0, 0, 0)', opacity: 1 })),
    state('void', style({ transform: 'translate3d(100%, 0, 0)', opacity: 0 })),
    state('exit', style({ transform: 'translate3d(100%, 0, 0)', opacity: 0 })),
    transition('* => *', animate('400ms cubic-bezier(0.25, 0.8, 0.25, 1)')),
  ])
};
