import { Search, SlidersHorizontal, X } from 'lucide-react'
import type { ReactNode } from 'react'

import { Button } from '@/components/ui/button'
import { Card, CardAction, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'

type FilterPanelProps = {
  ariaLabel: string
  children: ReactNode
  hasFilters: boolean
  onClear: () => void
  onSearchChange: (value: string) => void
  searchLabel: string
  searchPlaceholder: string
  searchValue: string
  title: string
}

export function FilterPanel({
  ariaLabel,
  children,
  hasFilters,
  onClear,
  onSearchChange,
  searchLabel,
  searchPlaceholder,
  searchValue,
  title,
}: FilterPanelProps) {
  return (
    <Card aria-label={ariaLabel} className="mt-8" role="region">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <SlidersHorizontal aria-hidden="true" size={17} />
          {title}
        </CardTitle>

        {hasFilters ? (
          <CardAction>
            <Button onClick={onClear} size="sm" type="button" variant="ghost">
              <X aria-hidden="true" />
              Clear
            </Button>
          </CardAction>
        ) : null}
      </CardHeader>

      <CardContent className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
        <label className="relative md:col-span-2">
          <span className="sr-only">{searchLabel}</span>
          <Search
            aria-hidden="true"
            className="pointer-events-none absolute top-1/2 left-2.5 z-10 -translate-y-1/2 text-muted-foreground"
            size={18}
          />
          <Input
            className="pl-9"
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder={searchPlaceholder}
            type="search"
            value={searchValue}
          />
        </label>

        {children}
      </CardContent>
    </Card>
  )
}
