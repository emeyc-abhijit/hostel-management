declare global {
  interface ImportMeta {
    env: {
      VITE_API_URL: string;
      MODE: string;
      DEV: boolean;
      PROD: boolean;
      SSR: boolean;
    };
  }
}

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

class ApiClient {
  private baseURL: string;

  constructor(baseURL: string = API_BASE_URL) {
    this.baseURL = baseURL;
  }

  private getToken(): string | null {
    return localStorage.getItem("token");
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
  ): Promise<T> {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    if (options.headers && typeof options.headers === "object") {
      Object.assign(headers, options.headers);
    }

    const token = this.getToken();
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const url = `${this.baseURL}${endpoint}`;

    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.message || `HTTP error! status: ${response.status}`,
      );
    }

    const data = await response.json();
    return data;
  }

  // Auth endpoints
  async register(
    name: string,
    email: string,
    password: string,
    role: "admin" | "warden" | "student",
  ): Promise<ApiResponse<any>> {
    return this.request("/auth/register", {
      method: "POST",
      body: JSON.stringify({ name, email, password, role }),
    });
  }

  async login(
    email: string,
    password: string,
    role: "admin" | "warden" | "student",
  ): Promise<ApiResponse<any>> {
    return this.request("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password, role }),
    });
  }

  async getCurrentUser(): Promise<ApiResponse<any>> {
    return this.request("/auth/me");
  }

  async updateProfile(data: any): Promise<ApiResponse<any>> {
    return this.request("/auth/profile", {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  async changePassword(
    currentPassword: string,
    newPassword: string,
  ): Promise<ApiResponse<any>> {
    return this.request("/auth/change-password", {
      method: "POST",
      body: JSON.stringify({ currentPassword, newPassword }),
    });
  }

  // Students endpoints
  async getAllStudents(page = 1, limit = 10): Promise<ApiResponse<any>> {
    return this.request(`/students?page=${page}&limit=${limit}`);
  }

  async getStudentById(id: string): Promise<ApiResponse<any>> {
    return this.request(`/students/${id}`);
  }

  async getMyProfile(): Promise<ApiResponse<any>> {
    return this.request("/students/me");
  }

  async createStudent(data: any): Promise<ApiResponse<any>> {
    return this.request("/students", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async updateStudent(id: string, data: any): Promise<ApiResponse<any>> {
    return this.request(`/students/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  async deleteStudent(id: string): Promise<ApiResponse<any>> {
    return this.request(`/students/${id}`, {
      method: "DELETE",
    });
  }

  async allocateRoom(
    studentId: string,
    roomId: string,
  ): Promise<ApiResponse<any>> {
    return this.request(`/students/${studentId}/allocate-room`, {
      method: "POST",
      body: JSON.stringify({ roomId }),
    });
  }

  // Hostels endpoints
  async getAllHostels(page = 1, limit = 10): Promise<ApiResponse<any>> {
    return this.request(`/hostels?page=${page}&limit=${limit}`);
  }

  async getHostelById(id: string): Promise<ApiResponse<any>> {
    return this.request(`/hostels/${id}`);
  }

  async createHostel(data: any): Promise<ApiResponse<any>> {
    return this.request("/hostels", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async updateHostel(id: string, data: any): Promise<ApiResponse<any>> {
    return this.request(`/hostels/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  async deleteHostel(id: string): Promise<ApiResponse<any>> {
    return this.request(`/hostels/${id}`, {
      method: "DELETE",
    });
  }

  // Rooms endpoints
  async getAllRooms(
    hostelId?: string,
    page = 1,
    limit = 10,
  ): Promise<ApiResponse<any>> {
    const query = new URLSearchParams();
    query.append("page", page.toString());
    query.append("limit", limit.toString());
    if (hostelId) query.append("hostelId", hostelId);
    return this.request(`/rooms?${query.toString()}`);
  }

  async getRoomById(id: string): Promise<ApiResponse<any>> {
    return this.request(`/rooms/${id}`);
  }

  async createRoom(data: any): Promise<ApiResponse<any>> {
    return this.request("/rooms", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async updateRoom(id: string, data: any): Promise<ApiResponse<any>> {
    return this.request(`/rooms/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  async deleteRoom(id: string): Promise<ApiResponse<any>> {
    return this.request(`/rooms/${id}`, {
      method: "DELETE",
    });
  }

  // Applications endpoints
  async getAllApplications(page = 1, limit = 10): Promise<ApiResponse<any>> {
    return this.request(`/applications?page=${page}&limit=${limit}`);
  }

  async getApplicationById(id: string): Promise<ApiResponse<any>> {
    return this.request(`/applications/${id}`);
  }

  async getMyApplication(): Promise<ApiResponse<any>> {
    return this.request("/applications/my");
  }

  async submitApplication(data: any): Promise<ApiResponse<any>> {
    return this.request("/applications", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async updateApplicationStatus(
    id: string,
    status: string,
  ): Promise<ApiResponse<any>> {
    return this.request(`/applications/${id}`, {
      method: "PUT",
      body: JSON.stringify({ status }),
    });
  }

  // Complaints endpoints
  async getAllComplaints(page = 1, limit = 10): Promise<ApiResponse<any>> {
    return this.request(`/complaints?page=${page}&limit=${limit}`);
  }

  async getComplaintById(id: string): Promise<ApiResponse<any>> {
    return this.request(`/complaints/${id}`);
  }

  async getMyComplaints(): Promise<ApiResponse<any>> {
    return this.request("/complaints/my");
  }

  async createComplaint(data: any): Promise<ApiResponse<any>> {
    return this.request("/complaints", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async updateComplaint(id: string, data: any): Promise<ApiResponse<any>> {
    return this.request(`/complaints/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  async deleteComplaint(id: string): Promise<ApiResponse<any>> {
    return this.request(`/complaints/${id}`, {
      method: "DELETE",
    });
  }

  // Notices endpoints
  async getAllNotices(page = 1, limit = 10): Promise<ApiResponse<any>> {
    return this.request(`/notices?page=${page}&limit=${limit}`);
  }

  async getNoticeById(id: string): Promise<ApiResponse<any>> {
    return this.request(`/notices/${id}`);
  }

  async createNotice(data: any): Promise<ApiResponse<any>> {
    return this.request("/notices", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async updateNotice(id: string, data: any): Promise<ApiResponse<any>> {
    return this.request(`/notices/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  async deleteNotice(id: string): Promise<ApiResponse<any>> {
    return this.request(`/notices/${id}`, {
      method: "DELETE",
    });
  }

  // Fees endpoints
  async getAllFees(page = 1, limit = 10): Promise<ApiResponse<any>> {
    return this.request(`/fees?page=${page}&limit=${limit}`);
  }

  async getFeeById(id: string): Promise<ApiResponse<any>> {
    return this.request(`/fees/${id}`);
  }

  async getMyFees(): Promise<ApiResponse<any>> {
    return this.request("/fees/my");
  }

  async createFeeRecord(data: any): Promise<ApiResponse<any>> {
    return this.request("/fees", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async updateFeeStatus(id: string, status: string): Promise<ApiResponse<any>> {
    return this.request(`/fees/${id}`, {
      method: "PUT",
      body: JSON.stringify({ status }),
    });
  }

  // Attendance endpoints
  async getMyAttendance(): Promise<ApiResponse<any>> {
    return this.request("/attendance/attendance/my");
  }

  async getAllAttendance(page = 1, limit = 10): Promise<ApiResponse<any>> {
    return this.request(`/attendance/attendance?page=${page}&limit=${limit}`);
  }

  async recordAttendance(data: any): Promise<ApiResponse<any>> {
    return this.request("/attendance/attendance", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  // Leave endpoints
  async getMyLeaveRequests(): Promise<ApiResponse<any>> {
    return this.request("/attendance/leaves/my");
  }

  async getAllLeaveRequests(page = 1, limit = 10): Promise<ApiResponse<any>> {
    return this.request(`/attendance/leaves?page=${page}&limit=${limit}`);
  }

  async submitLeaveRequest(data: any): Promise<ApiResponse<any>> {
    return this.request("/attendance/leaves", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async updateLeaveRequestStatus(
    id: string,
    status: string,
  ): Promise<ApiResponse<any>> {
    return this.request(`/attendance/leaves/${id}`, {
      method: "PUT",
      body: JSON.stringify({ status }),
    });
  }
}

export default new ApiClient();
