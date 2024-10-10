import Product from "../models/Product";
import Attribute from "../models/Attribute";
import { StatusCodes } from "http-status-codes";

export const index = async (req, res) => {
  try {
    const { _page = 1, _limit = 10, _embed } = req.query;
    const options = {
      page: parseInt(_page, 10),
      limit: parseInt(_limit, 10),
    };

    let query = Product.find();

    if (_embed) {
      const embeds = _embed.split(",");
      embeds.forEach((embed) => {
        query = query.populate(embed);
      });
    }

    const result = await Product.paginate(query, options);
    const { docs, ...paginationData } = result;

    if (!result) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: "Có lỗi xảy ra, vui lòng thử lại",
      });
    }

    return res.status(StatusCodes.OK).json({
      message: "Danh sách sản phẩm",
      data: docs,
      ...paginationData,
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

    const data = await Product.findOne({ _id: id })
        .populate("category", 'id name slug')

    if (!data) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: "Không tìm thấy sản phẩm, vui lòng thử lại",
      });
    }

    return res.status(StatusCodes.OK).json({
      message: "Chi tiet sản phẩm: " + data.name,
      data,
    });
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: error,
    });
  }
};

export const store = async (req, res) => {
  try {
    const { name, attributes } = req.body;

    // Kiểm tra sản phẩm đã tồn tại chưa
    const existingProduct = await Product.findOne({ name });

    if (existingProduct) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: "Sản phẩm đã tồn tại ",
      });
    }

    const productAttributes = await Attribute.find({
      _id: { $in: attributes },
    });

    if (productAttributes.length !== productAttributes.length) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: "Một hoặc nhiều thuộc tính không tìm thấy",
      });
    }

    const data = await Product.create(req.body);

    if (!data) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: "Có lỗi xảy ra, vui lòng thử lại",
      });
    }

    return res.status(StatusCodes.HTTP_CREATED).json({
      message: "Thao tác thành công",
      data,
    });
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Lỗi server",
    });
  }
};

export const update = async (req, res) => {
  try {
    const { id } = req.params;

    const data = await Product.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!data) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: "Không tìm thấy sản phẩm, vui lòng thử lại",
      });
    }

    return res.status(StatusCodes.HTTP_OK).json({
      message: "Cập nhật sản phẩm thành công: " + data.name,
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

    const data = await Product.findByIdAndDelete(id);

    if (!data) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: "Không tìm thấy  sản phẩm, vui lòng thử lại",
      });
    }

    return res.status(StatusCodes.NO_CONTENT).json({
      message: "Xóa  sản phẩm thành công",
    });
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Lỗi server",
    });
  }
};
