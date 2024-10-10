import Attribute from "../models/Attribute";

export const index = async (req, res) => {
  try {
    const { _page = 1, _limit = 1 } = req.query;

    const options = {
      page: parseInt(_page, 1),
      limit: parseInt(_limit, 1),
    };

    const result = await Attribute.paginate({}, options);
    const { docs, page, totalPages } = result;

    if (!result) {
      return res.status(404).json({
        message: "Có lỗi xảy ra, vui lòng thử lại",
      });
    }

    return res.status(201).json({
      message: "Danh sách danh mục",
      data: docs,
      totalPages: totalPages,
      currentPage: page,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Lỗi server",
    });
  }
};

export const show = async (req, res) => {
  try {
    const { id } = req.params;

    const data = await Attribute.findById(id);

    if (!data) {
      return res.status(404).json({
        message: "Không tìm thấy danh mục, vui lòng thử lại",
      });
    }

    return res.status(200).json({
      message: "Chi tiet danh muc: " + data.name,
      data,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Lỗi server",
    });
  }
};

export const store = async (req, res) => {
  try {
    const data = await Attribute.create(req.body);

    if (!data) {
      return res.status(404).json({
        message: "Có lỗi xảy ra, vui lòng thử lại",
      });
    }

    return res.status(201).json({
      message: "Thao tác thành công",
      data,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Lỗi server",
    });
  }
};

export const update = async (req, res) => {
  try {
    const { id } = req.params;

    const data = await Attribute.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    if (!data) {
      return res.status(404).json({
        message: "Không tìm thấy danh mục, vui lòng thử lại",
      });
    }

    return res.status(200).json({
      message: "Cập nhật danh mục thành công: " + data.name,
      data,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Lỗi server",
    });
  }
};

export const destroy = async (req, res) => {
  try {
    const { id } = req.params;

    const data = await Attribute.findByIdAndDelete(id);

    if (!data) {
      return res.status(404).json({
        message: "Không tìm thấy danh mục, vui lòng thử lại",
      });
    }

    return res.status(200).json({
      message: "Xóa danh mục thành công",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Lỗi server",
    });
  }
};
