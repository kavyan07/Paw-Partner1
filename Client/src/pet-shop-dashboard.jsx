"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import styled from "styled-components"
import {
  Store,
  Package,
  Users,
  Calendar,
  Settings,
  LogOut,
  Menu,
  X,
  Bell,
  Search,
  Plus,
  BarChart2,
  DollarSign,
  ShoppingBag,
  ChevronRight,
  User,
} from "lucide-react"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

// Styled Components
// (keeping all the styled components the same)

const API_BASE_URL = "http://localhost:8000/api/v1"

const DashboardContainer = styled.div`
  display: flex;
  height: 100vh;
`

const Sidebar = styled.aside`
  width: 250px;
  background-color: #f8f9fa;
  border-right: 1px solid #dee2e6;
  padding: 20px;
  transition: transform 0.3s ease-in-out;
  transform: translateX(${(props) => (props.$isOpen ? "0" : "-100%")});

  @media (min-width: 768px) {
    transform: translateX(0);
  }
`

const SidebarHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`

const Logo = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  font-weight: bold;
  color: #343a40;
`

const CloseButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  display: none;

  @media (max-width: 767px) {
    display: block;
  }
`

const SidebarMenu = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`

const MenuItem = styled.li`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 15px;
  margin-bottom: 5px;
  border-radius: 5px;
  cursor: pointer;
  color: #495057;
  background-color: ${(props) => (props.$active ? "#e9ecef" : "transparent")};

  &:hover {
    background-color: #e9ecef;
  }
`

const MenuText = styled.span`
  color: ${(props) => (props.$active ? "#000" : "#495057")};
`

const MainContent = styled.main`
  flex-grow: 1;
  padding: 20px;
  transition: margin-left 0.3s ease-in-out;
  margin-left: ${(props) => (props.$sidebarOpen ? "0" : "0")};

  @media (min-width: 768px) {
    margin-left: 0;
  }
`

const TopBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`

const MenuButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  margin-right: 20px;
  display: none;

  @media (max-width: 767px) {
    display: block;
  }
`

const SearchBar = styled.div`
  display: flex;
  align-items: center;
  background-color: #f1f3f5;
  border-radius: 5px;
  padding: 5px 10px;
`

const SearchInput = styled.input`
  border: none;
  background: none;
  padding: 5px;
  outline: none;
  color: #495057;
`

const UserActions = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
`

const NotificationBell = styled.div`
  position: relative;
  cursor: pointer;
`

const NotificationDot = styled.span`
  position: absolute;
  top: 0;
  right: 0;
  width: 8px;
  height: 8px;
  background-color: #dc3545;
  border-radius: 50%;
`

const UserAvatar = styled.div`
  width: 30px;
  height: 30px;
  background-color: #adb5bd;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #fff;
`

const DashboardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 20px;
`

const StatCard = styled.div`
  background-color: #fff;
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
`

const StatHeader = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-bottom: 10px;
`

const StatIcon = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: ${(props) => props.$bgColor};
  color: ${(props) => props.$iconColor};
  display: flex;
  justify-content: center;
  align-items: center;
`

const StatTitle = styled.h3`
  font-size: 1.2rem;
  color: #6c757d;
  margin-bottom: 5px;
`

const StatValue = styled.h2`
  font-size: 2rem;
  color: #343a40;
  margin-bottom: 10px;
`

const StatChange = styled.p`
  font-size: 0.9rem;
  color: ${(props) => (props.$positive ? "#28a745" : "#dc3545")};
`

const SectionTitle = styled.h2`
  font-size: 1.5rem;
  color: #343a40;
  margin-bottom: 15px;
`

const RecentOrdersCard = styled.div`
  background-color: #fff;
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
`

const OrdersHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`

const ViewAllButton = styled.button`
  background: none;
  border: none;
  color: #007bff;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 5px;
`

const OrdersTable = styled.table`
  width: 100%;
  border-collapse: collapse;
`

const TableHead = styled.thead`
  background-color: #f8f9fa;
`

const TableHeader = styled.th`
  padding: 10px;
  text-align: left;
  border-bottom: 1px solid #dee2e6;
`

const TableRow = styled.tr`
  &:nth-child(even) {
    background-color: #f8f9fa;
  }
`

const TableCell = styled.td`
  padding: 10px;
`

const StatusBadge = styled.span`
  padding: 5px 10px;
  border-radius: 5px;
  color: #fff;
  background-color: ${(props) => {
    switch (props.$status) {
      case "completed":
        return "#28a745"
      case "processing":
        return "#ffc107"
      case "pending":
        return "#17a2b8"
      case "cancelled":
        return "#dc3545"
      default:
        return "#6c757d"
    }
  }};
`

const AddButton = styled.button`
  background-color: #28a745;
  color: #fff;
  border: none;
  padding: 10px 15px;
  border-radius: 5px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 5px;
`

function PetShopDashboard() {
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [activeMenuItem, setActiveMenuItem] = useState("dashboard")
  const [shopData, setShopData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    revenue: 0,
    orders: 0,
    products: 0,
    customers: 0,
  })
  const [recentOrders, setRecentOrders] = useState([])

  useEffect(() => {
    // Fetch shop data - no need to check authentication here anymore
    fetchShopData()

    // Mock data for demonstration
    setStats({
      revenue: 12580,
      orders: 156,
      products: 43,
      customers: 89,
    })

    setRecentOrders([
      { id: "ORD-001", customer: "John Doe", date: "2023-05-15", amount: 125.99, status: "completed" },
      { id: "ORD-002", customer: "Jane Smith", date: "2023-05-14", amount: 89.5, status: "processing" },
      { id: "ORD-003", customer: "Mike Johnson", date: "2023-05-13", amount: 210.75, status: "pending" },
      { id: "ORD-004", customer: "Sarah Williams", date: "2023-05-12", amount: 45.25, status: "cancelled" },
      { id: "ORD-005", customer: "David Brown", date: "2023-05-11", amount: 178.3, status: "completed" },
    ])

    setLoading(false)

    // Log that the dashboard component has mounted
    console.log("PetShopDashboard component mounted")
  }, [])

  const fetchShopData = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:8000/api/v1/pet-shops/me', {
        headers: {
          Authorization: `Bearer ${token}`
        },
        withCredentials: true
      });
      setShopData(response.data);

      if (response.data && response.data.data) {
        setShopData(response.data.data)
        console.log("Shop data fetched successfully:", response.data.data)
      }
    } catch (error) {
      console.error("Error fetching shop data:", error)
      toast.error("Failed to load shop data")

      // If unauthorized, redirect to login
      if (error.response && error.response.status === 401) {
        localStorage.removeItem("token")
        localStorage.removeItem("user")
        localStorage.removeItem("userRole")
        navigate("/signin")
      }
    }
  }

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("token")

      if (token) {
        await axios.post(
          `${API_BASE_URL}/pet-shops/logout`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        )
      }
    } catch (error) {
      console.error("Logout error:", error)
    } finally {
      // Clear local storage regardless of API response
      localStorage.removeItem("token")
      localStorage.removeItem("user")
      localStorage.removeItem("userRole")

      toast.success("Logged out successfully")
      navigate("/signin")
    }
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(amount)
  }

  return (
    <DashboardContainer>
      <Sidebar $isOpen={sidebarOpen}>
        <SidebarHeader>
          <Logo>
            <Store />
            <span>{shopData?.shopName || "Pet Shop"}</span>
          </Logo>
          <CloseButton onClick={() => setSidebarOpen(false)}>
            <X size={20} />
          </CloseButton>
        </SidebarHeader>

        <SidebarMenu>
          <MenuItem $active={activeMenuItem === "dashboard"} onClick={() => setActiveMenuItem("dashboard")}>
            <BarChart2 size={20} />
            <MenuText $active={activeMenuItem === "dashboard"}>Dashboard</MenuText>
          </MenuItem>

          <MenuItem $active={activeMenuItem === "products"} onClick={() => setActiveMenuItem("products")}>
            <Package size={20} />
            <MenuText $active={activeMenuItem === "products"}>Products</MenuText>
          </MenuItem>

          <MenuItem $active={activeMenuItem === "orders"} onClick={() => setActiveMenuItem("orders")}>
            <ShoppingBag size={20} />
            <MenuText $active={activeMenuItem === "orders"}>Orders</MenuText>
          </MenuItem>

          <MenuItem $active={activeMenuItem === "customers"} onClick={() => setActiveMenuItem("customers")}>
            <Users size={20} />
            <MenuText $active={activeMenuItem === "customers"}>Customers</MenuText>
          </MenuItem>

          <MenuItem $active={activeMenuItem === "calendar"} onClick={() => setActiveMenuItem("calendar")}>
            <Calendar size={20} />
            <MenuText $active={activeMenuItem === "calendar"}>Calendar</MenuText>
          </MenuItem>

          <MenuItem $active={activeMenuItem === "settings"} onClick={() => setActiveMenuItem("settings")}>
            <Settings size={20} />
            <MenuText $active={activeMenuItem === "settings"}>Settings</MenuText>
          </MenuItem>

          <MenuItem onClick={handleLogout}>
            <LogOut size={20} />
            <MenuText>Logout</MenuText>
          </MenuItem>
        </SidebarMenu>
      </Sidebar>

      <MainContent $sidebarOpen={sidebarOpen}>
        <TopBar>
          <MenuButton onClick={() => setSidebarOpen(true)}>
            <Menu size={24} />
          </MenuButton>

          <SearchBar>
            <Search size={18} color="#666" />
            <SearchInput placeholder="Search..." />
          </SearchBar>

          <UserActions>
            <NotificationBell>
              <Bell size={20} />
              <NotificationDot />
            </NotificationBell>

            <UserAvatar>
              <User size={20} />
            </UserAvatar>
          </UserActions>
        </TopBar>

        {loading ? (
          <div>Loading dashboard...</div>
        ) : (
          <>
            <DashboardGrid>
              <StatCard>
                <StatHeader>
                  <StatIcon $bgColor="#E8F5E9" $iconColor="#4CAF50">
                    <DollarSign size={24} />
                  </StatIcon>
                </StatHeader>
                <StatTitle>Total Revenue</StatTitle>
                <StatValue>{formatCurrency(stats.revenue)}</StatValue>
                <StatChange $positive={true}>+12.5% from last month</StatChange>
              </StatCard>

              <StatCard>
                <StatHeader>
                  <StatIcon $bgColor="#E3F2FD" $iconColor="#2196F3">
                    <ShoppingBag size={24} />
                  </StatIcon>
                </StatHeader>
                <StatTitle>Total Orders</StatTitle>
                <StatValue>{stats.orders}</StatValue>
                <StatChange $positive={true}>+8.2% from last month</StatChange>
              </StatCard>

              <StatCard>
                <StatHeader>
                  <StatIcon $bgColor="#FFF8E1" $iconColor="#FFC107">
                    <Package size={24} />
                  </StatIcon>
                </StatHeader>
                <StatTitle>Total Products</StatTitle>
                <StatValue>{stats.products}</StatValue>
                <StatChange $positive={true}>+5.1% from last month</StatChange>
              </StatCard>

              <StatCard>
                <StatHeader>
                  <StatIcon $bgColor="#E1F5FE" $iconColor="#03A9F4">
                    <Users size={24} />
                  </StatIcon>
                </StatHeader>
                <StatTitle>Total Customers</StatTitle>
                <StatValue>{stats.customers}</StatValue>
                <StatChange $positive={true}>+15.3% from last month</StatChange>
              </StatCard>
            </DashboardGrid>

            <SectionTitle>Recent Orders</SectionTitle>

            <RecentOrdersCard>
              <OrdersHeader>
                <h3>Latest Transactions</h3>
                <ViewAllButton>
                  View All <ChevronRight size={16} />
                </ViewAllButton>
              </OrdersHeader>

              <OrdersTable>
                <TableHead>
                  <tr>
                    <TableHeader>Order ID</TableHeader>
                    <TableHeader>Customer</TableHeader>
                    <TableHeader>Date</TableHeader>
                    <TableHeader>Amount</TableHeader>
                    <TableHeader>Status</TableHeader>
                  </tr>
                </TableHead>
                <tbody>
                  {recentOrders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell>{order.id}</TableCell>
                      <TableCell>{order.customer}</TableCell>
                      <TableCell>{order.date}</TableCell>
                      <TableCell>{formatCurrency(order.amount)}</TableCell>
                      <TableCell>
                        <StatusBadge $status={order.status}>
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </StatusBadge>
                      </TableCell>
                    </TableRow>
                  ))}
                </tbody>
              </OrdersTable>
            </RecentOrdersCard>

            <SectionTitle>Manage Products</SectionTitle>

            <AddButton>
              <Plus size={18} />
              Add New Product
            </AddButton>
          </>
        )}
      </MainContent>
      <ToastContainer position="top-right" />
    </DashboardContainer>
  )
}

export default PetShopDashboard

