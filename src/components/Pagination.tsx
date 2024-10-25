import { memo } from "react";
import { Button } from "@/components/ui/button";

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

const Pagination = memo(({ currentPage, totalPages, onPageChange }: PaginationProps) => {
    return (
        <div className="mt-4 flex justify-center items-center space-x-4">
            <Button
                variant="outline"
                size="sm"
                onClick={() => onPageChange(Math.max(0, currentPage - 1))}
                disabled={currentPage === 0}
            >
                Previous
            </Button>
            <span>
                Page {currentPage + 1} of {totalPages}
            </span>
            <Button
                variant="outline"
                size="sm"
                onClick={() => onPageChange(Math.min(totalPages - 1, currentPage + 1))}
                disabled={currentPage === totalPages - 1}
            >
                Next
            </Button>
        </div>
    );
});

export default Pagination;
