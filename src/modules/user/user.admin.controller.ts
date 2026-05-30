import { Request, Response } from "express";
import { buildApiResponse } from "../../types/apiResponse";
import { asyncHandler } from "../../utils/asyncHandler";
import { adminUserService } from "./user.admin.service";

export const adminUserController = {
  users: asyncHandler(async (req: Request, res: Response) => {
    const usersData = await adminUserService.userList(req.query);

    const response = buildApiResponse({
      success: true,
      message: "OK!",
      data: usersData.docs,
      meta: {
        limit: usersData.limit,
        page: usersData.page as number,
        total: usersData.totalDocs,
        totalPages: usersData.totalPages,
        hasNextPage: usersData.hasNextPage,
        hasPrevPage: usersData.hasPrevPage,
      },
    });

    return res.status(200).json(response);
  }),

  singleUser: asyncHandler(async (req: Request, res: Response) => {
    const id = req.params.id as string;

    const user = await adminUserService.singleUser(id);

    const response = buildApiResponse({
      success: true,
      message: "OK!",
      data: user,
    });

    return res.status(200).json(response);
  }),

  instructorRequests: asyncHandler(async (req: Request, res: Response) => {
    const instructorRequestsData =
      await adminUserService.instructorRequestsList(req.query);

    const response = buildApiResponse({
      success: true,
      message: "OK!",
      data: instructorRequestsData.docs,
      meta: {
        limit: instructorRequestsData.limit,
        page: instructorRequestsData.page as number,
        total: instructorRequestsData.totalDocs,
        totalPages: instructorRequestsData.totalPages,
        hasNextPage: instructorRequestsData.hasNextPage,
        hasPrevPage: instructorRequestsData.hasPrevPage,
      },
    });

    return res.status(200).json(response);
  }),

  applyRequests: asyncHandler(async (req: Request, res: Response) => {
    const id = req.params.id as string;

    const data = await adminUserService.applyInstructorRequest(id);

    const response = buildApiResponse({
      success: true,
      message: "Request approved!",
      data,
    });

    return res.status(200).json(response);
  }),

  rejectRequests: asyncHandler(async (req: Request, res: Response) => {
    const id = req.params.id as string;

    const data = await adminUserService.rejectInstructorRequest(id);

    const response = buildApiResponse({
      success: true,
      message: "Request rejected!",
      data,
    });

    return res.status(200).json(response);
  }),
};
