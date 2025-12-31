export interface SuccessResponse<T> {
    success: true;
    message: string;
    data: T;
}

export interface ErrorResponse {
    success: false;
    message: string;
    error?: string;
}

export interface PaginatedResponse<T> {
    success: true;
    message: string;
    data: T[];
    meta: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
}

export class ResponseFormatter {
    static success<T>(data: T, message = 'Success'): SuccessResponse<T> {
        return {
            success: true,
            message,
            data,
        };
    }

    static error(message: string, error?: string): ErrorResponse {
        return {
            success: false,
            message,
            error,
        };
    }

    static paginate<T>(
        data: T[],
        total: number,
        page: number,
        limit: number,
        message = 'Success',
    ): PaginatedResponse<T> {
        return {
            success: true,
            message,
            data,
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        };
    }

    static created<T>(data: T, message = 'Created successfully'): SuccessResponse<T> {
        return this.success(data, message);
    }

    static updated<T>(data: T, message = 'Updated successfully'): SuccessResponse<T> {
        return this.success(data, message);
    }

    static deleted(message = 'Deleted successfully'): SuccessResponse<null> {
        return this.success(null, message);
    }

}
