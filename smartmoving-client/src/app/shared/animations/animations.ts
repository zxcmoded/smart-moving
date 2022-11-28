import { animate, query, sequence, style, transition, trigger } from '@angular/animations';

export const Animations = {
  expandCollapseAnimation: trigger(
      'expandCollapseAnimation',
      [
        transition(
            ':enter',
            [
              sequence([
                  style({ height: 0, opacity: 0 }),
                  animate('0.25s ease-in-out', style({ height: '*' })),
                  animate('0.25s ease-in-out', style({ opacity: 1 }))
                ]
              ),
            ]
        ),
        transition(
            ':leave',
            [
                sequence([
                  style({ height: '*', opacity: 1 }),
                  animate('0.25s ease-in-out', style({ opacity: 0 })),
                  animate('0.25s ease-in-out', style({ height: 0 }))
                ])
            ]
        )
      ]
  ),
  preventInitialChildAnimations: trigger(
      'preventInitialChildAnimations',
      [
        transition(':enter', [
          query(':enter', [], {optional: true})
        ])
      ]
  )
};
