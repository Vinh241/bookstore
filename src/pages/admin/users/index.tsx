import React, { useState, useEffect } from "react";
import {
  fetchAdminUsers,
  createAdminUser,
  updateAdminUser,
  deleteAdminUser,
} from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { toast } from "sonner";
import {
  Search,
  Plus,
  MoreVertical,
  Pencil,
  Trash2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

interface User {
  id: number;
  email: string;
  full_name: string;
  phone_number?: string;
  is_admin?: boolean;
  created_at: string;
}

const AdminUsers: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    full_name: "",
    phone_number: "",
    is_admin: false,
  });

  // Load users data
  const loadUsers = async () => {
    setLoading(true);
    try {
      const result = await fetchAdminUsers({
        page: currentPage,
        limit: 10,
        search,
      });

      setUsers(result.users);
      setTotalPages(result.totalPages);
    } catch (error) {
      toast.error("Không thể tải danh sách người dùng");
      console.error("Error loading users:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, [currentPage, search]);

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle checkbox changes
  const handleCheckboxChange = (checked: boolean) => {
    setFormData({
      ...formData,
      is_admin: checked,
    });
  };

  // Handle search input
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setCurrentPage(1); // Reset to first page when searching
  };

  // Handle search form submit
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loadUsers();
  };

  // Open create modal
  const openCreateModal = () => {
    setFormData({
      email: "",
      password: "",
      full_name: "",
      phone_number: "",
      is_admin: false,
    });
    setIsCreateModalOpen(true);
  };

  // Open edit modal
  const openEditModal = (user: User) => {
    setCurrentUser(user);
    setFormData({
      email: user.email,
      password: "", // We don't show the password in the edit form
      full_name: user.full_name,
      phone_number: user.phone_number || "",
      is_admin: user.is_admin || false,
    });
    setIsEditModalOpen(true);
  };

  // Open delete modal
  const openDeleteModal = (user: User) => {
    setCurrentUser(user);
    setIsDeleteModalOpen(true);
  };

  // Handle create user
  const handleCreateUser = async () => {
    try {
      await createAdminUser(formData);
      setIsCreateModalOpen(false);
      toast.success("Người dùng đã được tạo thành công");
      loadUsers();
    } catch (error: any) {
      toast.error(
        `Lỗi khi tạo người dùng: ${
          error.response?.data?.message || error.message
        }`
      );
    }
  };

  // Handle update user
  const handleUpdateUser = async () => {
    if (!currentUser) return;

    // Only send password if it's not empty
    const updateData = {
      ...formData,
      password: formData.password ? formData.password : undefined,
    };

    try {
      await updateAdminUser(currentUser.id, updateData);
      setIsEditModalOpen(false);
      toast.success("Người dùng đã được cập nhật thành công");
      loadUsers();
    } catch (error: any) {
      toast.error(
        `Lỗi khi cập nhật người dùng: ${
          error.response?.data?.message || error.message
        }`
      );
    }
  };

  // Handle delete user
  const handleDeleteUser = async () => {
    if (!currentUser) return;

    try {
      await deleteAdminUser(currentUser.id);
      setIsDeleteModalOpen(false);
      toast.success("Đã xóa người dùng thành công");
      loadUsers();
    } catch (error: any) {
      toast.error(
        `Lỗi khi xóa người dùng: ${
          error.response?.data?.message || error.message
        }`
      );
    }
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN");
  };

  return (
    <div className="container mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Quản lý người dùng</h1>
        <Button onClick={openCreateModal} variant="default">
          <Plus className="h-4 w-4 mr-2" />
          Thêm người dùng
        </Button>
      </div>

      {/* Search Form */}
      <form onSubmit={handleSearchSubmit} className="flex gap-2 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            type="text"
            placeholder="Tìm kiếm người dùng theo tên, email hoặc số điện thoại..."
            value={search}
            onChange={handleSearchChange}
            className="pl-9"
          />
        </div>
        <Button type="submit">Tìm kiếm</Button>
      </form>

      {/* Users Table */}
      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Họ tên</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Số điện thoại</TableHead>
              <TableHead>Quyền quản trị</TableHead>
              <TableHead>Ngày tạo</TableHead>
              <TableHead className="text-right">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-10">
                  Đang tải dữ liệu...
                </TableCell>
              </TableRow>
            ) : users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-10">
                  Không tìm thấy người dùng nào
                </TableCell>
              </TableRow>
            ) : (
              users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.id}</TableCell>
                  <TableCell>{user.full_name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.phone_number || "-"}</TableCell>
                  <TableCell>
                    {user.is_admin ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Quản trị viên
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        Người dùng
                      </span>
                    )}
                  </TableCell>
                  <TableCell>{formatDate(user.created_at)}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem onClick={() => openEditModal(user)}>
                          <Pencil className="h-4 w-4 mr-2" />
                          Sửa
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => openDeleteModal(user)}>
                          <Trash2 className="h-4 w-4 mr-2" />
                          Xóa
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {!loading && users.length > 0 && (
        <Pagination className="mt-6">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
              />
            </PaginationItem>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <PaginationItem key={page}>
                <PaginationLink
                  onClick={() => setCurrentPage(page)}
                  isActive={currentPage === page}
                >
                  {page}
                </PaginationLink>
              </PaginationItem>
            ))}

            <PaginationItem>
              <PaginationNext
                onClick={() =>
                  setCurrentPage((p) => Math.min(p + 1, totalPages))
                }
                disabled={currentPage === totalPages}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}

      {/* Create User Modal */}
      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Thêm người dùng mới</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="full_name" className="text-right">
                Họ tên
              </Label>
              <Input
                id="full_name"
                name="full_name"
                value={formData.full_name}
                onChange={handleInputChange}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">
                Email
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="phone_number" className="text-right">
                Số điện thoại
              </Label>
              <Input
                id="phone_number"
                name="phone_number"
                value={formData.phone_number}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="password" className="text-right">
                Mật khẩu
              </Label>
              <Input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleInputChange}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Quyền quản trị</Label>
              <div className="flex items-center space-x-2 col-span-3">
                <Checkbox
                  id="is_admin"
                  checked={formData.is_admin}
                  onCheckedChange={handleCheckboxChange}
                />
                <Label htmlFor="is_admin">
                  Người dùng này là quản trị viên
                </Label>
              </div>
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Hủy</Button>
            </DialogClose>
            <Button onClick={handleCreateUser}>Tạo người dùng</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit User Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Chỉnh sửa người dùng</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit_full_name" className="text-right">
                Họ tên
              </Label>
              <Input
                id="edit_full_name"
                name="full_name"
                value={formData.full_name}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit_email" className="text-right">
                Email
              </Label>
              <Input
                id="edit_email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit_phone_number" className="text-right">
                Số điện thoại
              </Label>
              <Input
                id="edit_phone_number"
                name="phone_number"
                value={formData.phone_number}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit_password" className="text-right">
                Mật khẩu mới
              </Label>
              <Input
                id="edit_password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleInputChange}
                className="col-span-3"
                placeholder="Để trống nếu không thay đổi"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Quyền quản trị</Label>
              <div className="flex items-center space-x-2 col-span-3">
                <Checkbox
                  id="edit_is_admin"
                  checked={formData.is_admin}
                  onCheckedChange={handleCheckboxChange}
                />
                <Label htmlFor="edit_is_admin">
                  Người dùng này là quản trị viên
                </Label>
              </div>
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Hủy</Button>
            </DialogClose>
            <Button onClick={handleUpdateUser}>Lưu thay đổi</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete User Confirmation Modal */}
      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Xác nhận xóa người dùng</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p>
              Bạn có chắc chắn muốn xóa người dùng{" "}
              <strong>{currentUser?.full_name}</strong> ({currentUser?.email})?
            </p>
            <p className="mt-2 text-red-500">
              Hành động này không thể hoàn tác.
            </p>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Hủy</Button>
            </DialogClose>
            <Button variant="destructive" onClick={handleDeleteUser}>
              Xóa người dùng
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminUsers;
