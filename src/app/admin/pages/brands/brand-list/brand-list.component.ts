import { Component, OnInit } from "@angular/core";
import { BrandService } from "../../../services/brand.service";
import { IBrand } from "../../../../core/models/structureData";
import { Router } from "@angular/router";
import Swal from "sweetalert2";
import { CommonModule } from "@angular/common";

@Component({
  selector: "app-brand-list",
  templateUrl: "./brand-list.component.html",
  imports: [CommonModule],
  styleUrls: ["./brand-list.component.css"],
})
export class BrandListComponent implements OnInit {
  brands: IBrand[] = [];

  constructor(private brandService: BrandService) {}

  ngOnInit(): void {
    this.loadBrands();
  }

  loadBrands() {
    this.brandService.getBrands().subscribe({
      next: (data) => (this.brands = data),
      error: () =>
        Swal.fire("Lỗi", "Không thể tải danh sách thương hiệu", "error"),
    });
  }

  onAdd() {
    Swal.fire({
      title: "Thêm thương hiệu",
      html: `
      <div class="bg-white mx-4">
        <div class="mb-4">
          <label class="block text-md font-semibold text-gray-700 mb-1 text-left">Tên thương hiệu</label>
          <input id="brandName" class="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300" placeholder="Nhập tên thương hiệu">
        </div>

        <div class="mb-4">
          <label class="block text-md font-semibold text-gray-700 mb-1 text-left">Mô tả</label>
          <textarea id="brandDesc" class="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300" placeholder="Nhập mô tả"></textarea>
        </div>
        
  
        <div id="brandStatus" class="">
          <label class="block text-md font-semibold text-gray-700 mb-1 text-left">Mô tả</label>
          <label style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px; cursor: pointer;">
            <input type="radio" name="brandStatus" value="1" checked style="accent-color: #2563eb; transform: scale(1.2);">
            <span>Hoạt động</span>
          </label>
    
          <label style="display: flex; align-items: center; gap: 8px; cursor: pointer;">
            <input type="radio" name="brandStatus" value="0" style="accent-color: #dc2626; transform: scale(1.2);">
            <span>Ẩn</span>
          </label>
        </div>
      </div>
    `,
      showCancelButton: true,
      confirmButtonText: "Thêm",
      cancelButtonText: "Hủy",
      focusConfirm: false,
      preConfirm: () => {
        const name = (
          document.getElementById("brandName") as HTMLInputElement
        ).value.trim();
        const description = (
          document.getElementById("brandDesc") as HTMLTextAreaElement
        ).value.trim();
        const status =
          document.querySelector<HTMLInputElement>(
            'input[name="brandStatus"]:checked'
          )?.value ?? "1";

        if (!name) {
          Swal.showValidationMessage("Tên thương hiệu là bắt buộc");
          return false;
        }

        return { name, description, status };
      },
    }).then((result) => {
      if (result.isConfirmed && result.value) {
        Swal.fire({
          title: "Đang lưu...",
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading();
          },
        });

        this.brandService.createBrand(result.value).subscribe({
          next: () => {
            Swal.fire("Thành công", "Thêm thương hiệu thành công!", "success");
            this.loadBrands(); // 🔥 Reload lại danh sách ngay sau khi thêm
          },
          error: () => {
            Swal.fire("Lỗi", "Không thể thêm thương hiệu", "error");
          },
        });
      }
    });
  }

  onDelete(id: number | undefined) {
    if (!id) return;

    Swal.fire({
      title: "Bạn có chắc chắn?",
      text: "Thương hiệu sẽ bị xóa vĩnh viễn!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Xóa",
      cancelButtonText: "Hủy",
    }).then((res) => {
      if (res.isConfirmed) {
        this.brandService.deleteBrand(id).subscribe({
          next: () => {
            Swal.fire("Đã xóa!", "Thương hiệu đã được xóa.", "success");
            this.loadBrands();
          },
          error: () => Swal.fire("Lỗi", "Không thể xóa thương hiệu", "error"),
        });
      }
    });
  }

  onEdit(brand: any) {
    Swal.fire({
      title: "Sửa thương hiệu",
      html: `
     <div class="bg-white mx-4">
      <!-- Tên thương hiệu -->
      <div class="mb-4">
        <label class="block text-md font-semibold text-gray-700 mb-1 text-left">Tên thương hiệu</label>
        <input id="brandName" value="${
          brand.name || ""
        }" class="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300" placeholder="Nhập tên thương hiệu">
      </div>

      <!-- Mô tả -->
      <div class="mb-4">
        <label class="block text-md font-semibold text-gray-700 mb-1 text-left">Mô tả</label>
        <textarea id="brandDesc" class="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300" placeholder="Nhập mô tả">${
          brand.description || ""
        }</textarea>
      </div>
      
      <!-- Trạng thái -->
      <div id="brandStatus">
        <label class="block text-md font-semibold text-gray-700 mb-1 text-left">Trạng thái</label>
        
        <label style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px; cursor: pointer;">
          <input type="radio" name="brandStatus" value="1" 
            ${brand.status === 1 ? "checked" : ""} 
            style="accent-color: #2563eb; transform: scale(1.2);">
          <span>Hoạt động</span>
        </label>

        <label style="display: flex; align-items: center; gap: 8px; cursor: pointer;">
          <input type="radio" name="brandStatus" value="0" 
            ${brand.status === 0 ? "checked" : ""} 
            style="accent-color: #dc2626; transform: scale(1.2);">
          <span>Ẩn</span>
        </label>
      </div>
    </div>
  `,
      showCancelButton: true,
      confirmButtonText: "Cập nhật",
      cancelButtonText: "Hủy",
      focusConfirm: false,
      preConfirm: () => {
        const name = (
          document.getElementById("brandName") as HTMLInputElement
        ).value.trim();
        const description = (
          document.getElementById("brandDesc") as HTMLTextAreaElement
        ).value.trim();
        const statusEl = document.querySelector(
          'input[name="brandStatus"]:checked'
        ) as HTMLInputElement;

        const status = statusEl ? parseInt(statusEl.value, 10) : null;

        if (!name) {
          Swal.showValidationMessage("Tên thương hiệu là bắt buộc");
          return false;
        }
        if (status === null) {
          Swal.showValidationMessage("Vui lòng chọn trạng thái");
          return false;
        }

        return { name, description, status };
      },
    }).then((result) => {
      if (result.isConfirmed && result.value) {
        Swal.fire({
          title: "Đang cập nhật...",
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading();
          },
        });

        this.brandService.updateBrand(brand.id, result.value).subscribe({
          next: () => {
            Swal.fire(
              "Thành công",
              "Cập nhật thương hiệu thành công!",
              "success"
            );
            this.loadBrands(); // 🔄 Reload danh sách
          },
          error: () => {
            Swal.fire("Lỗi", "Không thể cập nhật thương hiệu", "error");
          },
        });
      }
    });
  }
}
