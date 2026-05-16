import * as React from 'react'
import { Progress as ProgressPrimitive } from 'radix-ui'

import { cn } from '#/lib/utils.ts'

function Progress({
  className,
  value,
  indicatorColor,
  ...props
}: React.ComponentProps<typeof ProgressPrimitive.Root> & {
  indicatorColor?: string
}) {
  return (
    <ProgressPrimitive.Root
      data-slot="progress"
      className={cn(
        'relative h-2 w-full overflow-hidden rounded-full bg-primary/20',
        className,
      )}
      {...props}
      style={{
        backgroundColor: `rgb(from ${indicatorColor} r g b / 30%)`,
      }}
    >
      <ProgressPrimitive.Indicator
        data-slot="progress-indicator"
        className={cn('h-full w-full flex-1 bg-primary transition-all')}
        style={{
          transform: `translateX(-${100 - (value || 0)}%)`,
          backgroundColor: indicatorColor,
        }}
      />
    </ProgressPrimitive.Root>
  )
}

export { Progress }
