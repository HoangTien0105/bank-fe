import { ButtonGroup, Flex, IconButton } from '@chakra-ui/react';
import Link from 'next/link';
import { LuChevronLeft, LuChevronRight } from 'react-icons/lu';

interface PaginationControlsProps {
  currentPage: number;
  totalPages: number;
}

const PaginationControls = ({ currentPage, totalPages }: PaginationControlsProps) => {
  const createPageURL = (pageNumber: number | string) => {
    const params = new URLSearchParams();
    params.set('page', pageNumber.toString());
    return `?${params.toString()}`;
  };

  return (
    <Flex justifyContent="center" mt={4}>
      <ButtonGroup variant="ghost" size="sm" wrap="wrap">
        <Link href={createPageURL(currentPage - 1)}>
          <IconButton 
            aria-label="Previous page"
            disabled={currentPage <= 1}
            pointerEvents={currentPage <= 1 ? "none" : "auto"}
            opacity={currentPage <= 1 ? 0.5 : 1}
          >
            <LuChevronLeft />
          </IconButton>
        </Link>

        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <Link key={page} href={createPageURL(page)}>
            <IconButton
              aria-label={`Page ${page}`}
              variant={currentPage === page ? "outline" : "ghost"}
              bg={currentPage === page ? "blue.50" : "transparent"}
              color={currentPage === page ? "blue.600" : "inherit"}
            >
              {page}
            </IconButton>
          </Link>
        ))}

        <Link href={createPageURL(currentPage + 1)}>
          <IconButton 
            aria-label="Next page"
            disabled={currentPage >= totalPages}
            pointerEvents={currentPage >= totalPages ? "none" : "auto"}
            opacity={currentPage >= totalPages ? 0.5 : 1}
          >
            <LuChevronRight />
          </IconButton>
        </Link>
      </ButtonGroup>
    </Flex>
  );
};

export default PaginationControls;