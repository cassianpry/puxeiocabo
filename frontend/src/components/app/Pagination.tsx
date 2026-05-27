import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
} from '@/components/ui/pagination'

function range(start: number, end: number) {
  return Array.from({ length: end - start + 1 }, (_, i) => start + i)
}

interface AppPaginationProps {
  page: number
  totalPages: number
  onPageChange: (page: number) => void
  className?: string
}

export function AppPagination({ page, totalPages, onPageChange, className }: AppPaginationProps) {
  if (totalPages <= 1) return null

  function renderPageNumbers() {
    const pages: React.ReactNode[] = []
    const siblingCount = 1
    const current = page
    const firstPage = 1
    const lastPage = totalPages
    const leftSibling = Math.max(current - siblingCount, firstPage)
    const rightSibling = Math.min(current + siblingCount, lastPage)
    const showLeftEllipsis = leftSibling > firstPage + 1
    const showRightEllipsis = rightSibling < lastPage - 1

    if (totalPages <= 7) {
      range(1, totalPages).forEach((p) => {
        pages.push(
          <PaginationItem key={p}>
            <PaginationLink isActive={p === current} className={p !== current ? 'cursor-pointer' : ''} onClick={() => onPageChange(p)}>
              {p}
            </PaginationLink>
          </PaginationItem>,
        )
      })
      return pages
    }

    pages.push(
      <PaginationItem key={1}>
        <PaginationLink isActive={current === 1} className={current !== 1 ? 'cursor-pointer' : ''} onClick={() => onPageChange(1)}>
          1
        </PaginationLink>
      </PaginationItem>,
    )

    if (showLeftEllipsis) {
      pages.push(<PaginationEllipsis key="left" />)
    }

    range(leftSibling, rightSibling).forEach((p) => {
      if (p !== 1 && p !== lastPage) {
        pages.push(
          <PaginationItem key={p}>
            <PaginationLink isActive={p === current} className={p !== current ? 'cursor-pointer' : ''} onClick={() => onPageChange(p)}>
              {p}
            </PaginationLink>
          </PaginationItem>,
        )
      }
    })

    if (showRightEllipsis) {
      pages.push(<PaginationEllipsis key="right" />)
    }

    pages.push(
      <PaginationItem key={lastPage}>
        <PaginationLink isActive={current === lastPage} className={current !== lastPage ? 'cursor-pointer' : ''} onClick={() => onPageChange(lastPage)}>
          {lastPage}
        </PaginationLink>
      </PaginationItem>,
    )

    return pages
  }

  return (
    <Pagination className={className}>
      <PaginationContent>
        <PaginationItem>
          <PaginationLink
            size="default"
            onClick={() => onPageChange(page - 1)}
            className={cn('gap-1 px-2.5 sm:pl-2.5', page <= 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer')}
            aria-label="Ir para página anterior"
          >
            <ChevronLeftIcon />
            <span className="hidden sm:block">Anterior</span>
          </PaginationLink>
        </PaginationItem>
        {renderPageNumbers()}
        <PaginationItem>
          <PaginationLink
            size="default"
            onClick={() => onPageChange(page + 1)}
            className={cn('gap-1 px-2.5 sm:pr-2.5', page >= totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer')}
            aria-label="Ir para próxima página"
          >
            <span className="hidden sm:block">Próximo</span>
            <ChevronRightIcon />
          </PaginationLink>
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  )
}
