import Category from "../models/Category";
import { StatusCodes } from "http-status-codes";
import { categoryRequest } from "../validation/CategoryRequest";

export const index = async (req, res) => {
  try {
    const { _page = 1, _limit = 1 } = req.query;

    const options = {
      page: parseInt(_page, 1),
      limit: parseInt(_limit, 1),
    };

    const result = await Category.paginate({}, options);
    const { docs, page, totalPages } = result;

    if (!result) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: "Có lỗi xảy ra, vui lòng thử lại",
      });
    }

    return res.status(StatusCodes.OK).json({
      message: "Danh sách danh mục",
      data: docs,
      totalPages: totalPages,
      currentPage: page,
    });
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Lỗi server",
    });
  }
};

export const show = async (req, res) => {
  try {
    const { id } = req.params;

    const data = await Category.findById(id);

    if (!data) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: "Không tìm thấy danh mục, vui lòng thử lại",
      });
    }

    return res.status(StatusCodes.HTTP_OK).json({
      message: "Chi tiet danh muc: " + data.name,
      data,
    });
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Lỗi server",
    });
  }
};

export const store = async (req, res) => {
  try {
    const data = await Category.create(req.body);

    if (!data) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: "Có lỗi xảy ra, vui lòng thử lại",
      });
    }

    return res.status(StatusCodes.CREATED).json({
      message: "Thao tác thành công",
      data,
    });
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: error,
    });
  }
};

export const update = async (req, res) => {
  try {
    const { id } = req.params;

    const data = await Category.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    if (!data) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: "Không tìm thấy danh mục, vui lòng thử lại",
      });
    }

    return res.status(StatusCodes.HTTP_OK).json({
      message: "Cập nhật danh mục thành công: " + data.name,
      data,
    });
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Lỗi server",
    });
  }
};

export const destroy = async (req, res) => {
  try {
    const { id } = req.params;

    const data = await Category.findByIdAndDelete(id);

    if (!data) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: "Không tìm thấy danh mục, vui lòng thử lại",
      });
    }

    return res.status(StatusCodes.NO_CONTENT).json({
      message: "Xóa danh mục thành công",
    });
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Lỗi server",
    });
  }
};
