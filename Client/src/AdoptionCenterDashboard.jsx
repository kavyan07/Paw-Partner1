"use client"

import { useState, useEffect } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import styled from "styled-components"
import {
  Heart,
  PlusCircle,
  Calendar,
  MessageSquare,
  Settings,
  LogOut,
  Bell,
  Menu,
  X,
  ChevronDown,
  Users,
  Home,
  PawPrint,
  FileText,
  CheckCircle,
  Search,
  HelpCircle,
} from "lucide-react"

const PageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: #f8f9fa;
`

const MainContainer = styled.div`
  display: flex;
  flex: 1;
`

const Sidebar = styled.aside`
  width: 280px;
  background: white;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  z-index: 100;
  transition: all 0.3s ease;
  overflow-y: auto;
  
  @media (max-width: 992px) {
    transform: ${(props) => (props.isOpen ? "translateX(0)" : "translateX(-100%)")};
  }
`

const SidebarHeader = styled.div`
  padding: 25px 25px 20px;
  border-bottom: 1px solid #f0f0f0;
`

const CenterLogo = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 10px;

  svg {
    color: #FF6B6B;
    width: 28px;
    height: 28px;
  }

  h1 {
    font-size: 1.5rem;
    font-weight: 700;
    color: #333;
    margin: 0;
  }
`

const CenterName = styled.h2`
  font-size: 1rem;
  color: #666;
  margin: 0;
`

const NavMenu = styled.nav`
  margin-top: 20px;
  padding: 0 15px;
`

const NavSection = styled.div`
  margin-bottom: 20px;
`

const NavSectionTitle = styled.h3`
  font-size: 0.8rem;
  text-transform: uppercase;
  color: #999;
  margin: 15px 10px 10px;
  letter-spacing: 1px;
`

const NavItem = styled.a`
  display: flex;
  align-items: center;
  padding: 12px 15px;
  color: ${(props) => (props.active ? "#FF6B6B" : "#555")};
  text-decoration: none;
  transition: all 0.2s ease;
  border-radius: 8px;
  margin-bottom: 5px;
  background: ${(props) => (props.active ? "#FFF0F0" : "transparent")};
  font-weight: ${(props) => (props.active ? "600" : "500")};
  
  &:hover {
    background: #FFF0F0;
    color: #FF6B6B;
  }

  svg {
    width: 18px;
    height: 18px;
    margin-right: 12px;
  }
`

const LogoutButton = styled.button`
  display: flex;
  align-items: center;
  padding: 12px 15px;
  color: #555;
  background: none;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
  width: 100%;
  text-align: left;
  font-size: 0.95rem;
  border-radius: 8px;
  margin: 10px 0;
  
  &:hover {
    background: #FFF0F0;
    color: #FF6B6B;
  }

  svg {
    width: 18px;
    height: 18px;
    margin-right: 12px;
  }
`

const Content = styled.main`
  flex: 1;
  padding: 30px;
  margin-left: 280px;
  transition: all 0.3s ease;

  @media (max-width: 992px) {
    margin-left: 0;
    padding: 20px;
  }
`

const MobileTopBar = styled.div`
  display: none;
  align-items: center;
  justify-content: space-between;
  padding: 15px 20px;
  background: white;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  position: sticky;
  top: 0;
  z-index: 99;

  @media (max-width: 992px) {
    display: flex;
  }
`

const MenuButton = styled.button`
  background: none;
  border: none;
  color: #555;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px;
  border-radius: 8px;
  transition: all 0.2s ease;
  
  &:hover {
    background: #f5f5f5;
  }
  
  svg {
    width: 24px;
    height: 24px;
  }
`

const MobileLogo = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;

  svg {
    color: #FF6B6B;
    width: 24px;
    height: 24px;
  }

  h1 {
    font-size: 1.2rem;
    font-weight: 700;
    color: #333;
    margin: 0;
  }
`

const DashboardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
`

const PageTitle = styled.h1`
  font-size: 1.8rem;
  color: #333;
  margin: 0;
`

const HeaderActions = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
`

const SearchBar = styled.div`
  position: relative;
  width: 250px;
  
  @media (max-width: 768px) {
    display: none;
  }
  
  input {
    width: 100%;
    padding: 10px 15px 10px 40px;
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    font-size: 0.9rem;
    transition: all 0.2s ease;
    
    &:focus {
      outline: none;
      border-color: #FF6B6B;
      box-shadow: 0 0 0 3px rgba(255, 107, 107, 0.1);
    }
  }
  
  svg {
    position: absolute;
    left: 12px;
    top: 50%;
    transform: translateY(-50%);
    color: #999;
    width: 18px;
    height: 18px;
  }
`

const ActionButton = styled.button`
  background: white;
  border: none;
  width: 40px;
  height: 40px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  position: relative;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
  transition: all 0.2s ease;
  
  &:hover {
    background: #f9f9f9;
    transform: translateY(-2px);
  }
  
  svg {
    color: #666;
    width: 18px;
    height: 18px;
  }

  &::after {
    content: '';
    position: absolute;
    top: 10px;
    right: 10px;
    width: 8px;
    height: 8px;
    background: #FF6B6B;
    border-radius: 50%;
    display: ${(props) => (props.hasNotifications ? "block" : "none")};
  }
`

const ProfileButton = styled.button`
  background: white;
  border: none;
  padding: 6px 12px 6px 6px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
  transition: all 0.2s ease;
  
  &:hover {
    background: #f9f9f9;
    transform: translateY(-2px);
  }
  
  img {
    width: 32px;
    height: 32px;
    border-radius: 8px;
    object-fit: cover;
  }

  span {
    font-weight: 500;
    color: #333;
    font-size: 0.9rem;
  }

  svg {
    color: #666;
    width: 16px;
    height: 16px;
  }
`

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
`

const StatCard = styled.div`
  background: white;
  border-radius: 12px;
  padding: 25px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.08);
  }
`

const StatHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 15px;

  h3 {
    font-size: 1rem;
    color: #666;
    margin: 0;
  }

  .icon {
    width: 40px;
    height: 40px;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: ${(props) => props.bgColor || "#FFF0F0"};
    
    svg {
      color: ${(props) => props.iconColor || "#FF6B6B"};
      width: 20px;
      height: 20px;
    }
  }
`

const StatValue = styled.div`
  font-size: 1.8rem;
  font-weight: 700;
  color: #333;
`

const StatChange = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
  margin-top: 5px;
  font-size: 0.85rem;
  color: ${(props) => (props.isPositive ? "#4CAF50" : "#FF5252")};
  
  svg {
    width: 14px;
    height: 14px;
  }
`

const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 30px 0 20px;
`

const SectionTitle = styled.h2`
  font-size: 1.4rem;
  color: #333;
  margin: 0;
`

const ViewAllLink = styled.a`
  color: #FF6B6B;
  text-decoration: none;
  font-size: 0.9rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 5px;
  
  &:hover {
    text-decoration: underline;
  }
`

const PetsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
  margin-bottom: 40px;
`

const PetCard = styled.div`
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.08);
  }
`

const PetImage = styled.div`
  height: 200px;
  overflow: hidden;
  position: relative;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: all 0.5s ease;
  }

  ${PetCard}:hover & img {
    transform: scale(1.05);
  }
`

const PetInfo = styled.div`
  padding: 20px;
`

const PetName = styled.h3`
  font-size: 1.2rem;
  margin: 0 0 5px;
  color: #333;
`

const PetDetails = styled.div`
  display: flex;
  gap: 15px;
  margin-bottom: 15px;
`

const PetDetail = styled.div`
  font-size: 0.9rem;
  color: #666;
  
  span {
    font-weight: 600;
    color: #333;
  }
`

const PetStatus = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 0.9rem;
  color: ${(props) => (props.adopted ? "#4CAF50" : "#FF6B6B")};
  font-weight: 600;
  
  svg {
    width: 16px;
    height: 16px;
  }
`

const AddPetButton = styled.button`
  position: fixed;
  bottom: 30px;
  right: 30px;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: #FF6B6B;
  color: white;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 5px 15px rgba(255, 107, 107, 0.3);
  transition: all 0.3s ease;
  z-index: 90;
  
  &:hover {
    background: #FF5252;
    transform: scale(1.1);
  }
  
  svg {
    width: 24px;
    height: 24px;
  }
`

function AdoptionCenterDashboard() {
  const navigate = useNavigate()
  const location = useLocation()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("dashboard")

  // Get user data from localStorage
  const userDataString = localStorage.getItem("user")
  const userData = userDataString ? JSON.parse(userDataString) : null

  // Get adoption center name from user data or state
  const adoptionCenterName = userData?.adoptionCenterName || "Your Adoption Center"
  const adminName = userData?.username || "Admin"

  const [centerData, setCenterData] = useState({
    name: adoptionCenterName,
    admin: adminName,
    stats: {
      availablePets: 12,
      availablePetsChange: "+2",
      adoptedPets: 45,
      adoptedPetsChange: "+5",
      pendingApplications: 8,
      pendingApplicationsChange: "-1",
      totalApplications: 67,
      totalApplicationsChange: "+3",
    },
    pets: [
      {
        id: 1,
        name: "Max",
        image: "https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&q=80",
        age: "2 years",
        breed: "Golden Retriever",
        adopted: false,
      },
      {
        id: 2,
        name: "Bella",
        image: "https://images.unsplash.com/photo-1561037404-61cd46aa615b?auto=format&fit=crop&q=80",
        age: "1 year",
        breed: "Siamese Cat",
        adopted: false,
      },
      {
        id: 3,
        name: "Charlie",
        image: "https://images.unsplash.com/photo-1596492784531-6e6eb5ea9993?auto=format&fit=crop&q=80",
        age: "3 years",
        breed: "Labrador",
        adopted: true,
      },
      {
        id: 4,
        name: "Luna",
        image: "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&q=80",
        age: "6 months",
        breed: "Beagle",
        adopted: false,
      },
    ],
  })

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem("token")
    const userRole = localStorage.getItem("userRole")

    if (!token || userRole !== "adoptionCenter") {
      navigate("/signin")
      return
    }

    // Here you would fetch the adoption center data from your API
    // For now, we're using the mock data defined above
    // Example API call:
    // const fetchCenterData = async () => {
    //   try {
    //     const response = await axios.get(
    //       "http://localhost:8000/api/v1/adoption-centers/dashboard",
    //       { withCredentials: true }
    //     );
    //     setCenterData(response.data);
    //   } catch (error) {
    //     console.error("Failed to fetch center data", error);
    //     // Handle error - redirect to login if unauthorized
    //     if (error.response?.status === 401) {
    //       navigate('/signin');
    //     }
    //   }
    // };
    //
    // fetchCenterData();
  }, [navigate])

  const handleLogout = async () => {
    try {
      // await axios.post(
      //   "http://localhost:8000/api/v1/users/logout",
      //   {},
      //   { withCredentials: true }
      // );
      localStorage.removeItem("token")
      localStorage.removeItem("userRole")
      localStorage.removeItem("user")
      navigate("/signin")
    } catch (error) {
      console.error("Logout failed", error)
    }
  }

  return (
    <PageWrapper>
      {/* Main Container */}
      <MainContainer>
        {/* Mobile Top Bar - only visible on mobile */}
        <MobileTopBar>
          <MenuButton onClick={() => setSidebarOpen(true)}>
            <Menu />
          </MenuButton>
          <MobileLogo>
            <Heart />
            <h1>PetAdopt</h1>
          </MobileLogo>
          <ActionButton hasNotifications={true}>
            <Bell />
          </ActionButton>
        </MobileTopBar>

        {/* Sidebar */}
        <Sidebar isOpen={sidebarOpen}>
          <SidebarHeader>
            <CenterLogo>
              <Heart />
              <h1>PetAdopt</h1>
            </CenterLogo>
            <CenterName>{centerData.name}</CenterName>
          </SidebarHeader>

          <MenuButton
            onClick={() => setSidebarOpen(false)}
            style={{
              display: sidebarOpen ? "block" : "none",
              position: "absolute",
              right: "10px",
              top: "10px",
            }}
          >
            <X />
          </MenuButton>

          <NavMenu>
            <NavSection>
              <NavSectionTitle>Main</NavSectionTitle>
              <NavItem
                href="#"
                active={activeTab === "dashboard"}
                onClick={(e) => {
                  e.preventDefault()
                  setActiveTab("dashboard")
                  setSidebarOpen(false)
                }}
              >
                <Home />
                Dashboard
              </NavItem>
              <NavItem
                href="#"
                active={activeTab === "pets"}
                onClick={(e) => {
                  e.preventDefault()
                  setActiveTab("pets")
                  setSidebarOpen(false)
                }}
              >
                <PawPrint />
                Pets
              </NavItem>
              <NavItem
                href="#"
                active={activeTab === "applications"}
                onClick={(e) => {
                  e.preventDefault()
                  setActiveTab("applications")
                  setSidebarOpen(false)
                }}
              >
                <FileText />
                Applications
              </NavItem>
            </NavSection>

            <NavSection>
              <NavSectionTitle>Management</NavSectionTitle>
              <NavItem
                href="#"
                active={activeTab === "appointments"}
                onClick={(e) => {
                  e.preventDefault()
                  setActiveTab("appointments")
                  setSidebarOpen(false)
                }}
              >
                <Calendar />
                Appointments
              </NavItem>
              <NavItem
                href="#"
                active={activeTab === "messages"}
                onClick={(e) => {
                  e.preventDefault()
                  setActiveTab("messages")
                  setSidebarOpen(false)
                }}
              >
                <MessageSquare />
                Messages
              </NavItem>
            </NavSection>

            <NavSection>
              <NavSectionTitle>Account</NavSectionTitle>
              <NavItem
                href="#"
                active={activeTab === "settings"}
                onClick={(e) => {
                  e.preventDefault()
                  setActiveTab("settings")
                  setSidebarOpen(false)
                }}
              >
                <Settings />
                Settings
              </NavItem>
              <NavItem
                href="#"
                active={activeTab === "help"}
                onClick={(e) => {
                  e.preventDefault()
                  setActiveTab("help")
                  setSidebarOpen(false)
                }}
              >
                <HelpCircle />
                Help & Support
              </NavItem>
            </NavSection>

            <LogoutButton onClick={handleLogout}>
              <LogOut />
              Logout
            </LogoutButton>
          </NavMenu>
        </Sidebar>

        {/* Main Dashboard Content */}
        <Content>
          <DashboardHeader>
            <PageTitle>Dashboard</PageTitle>
            <HeaderActions>
              <SearchBar>
                <Search />
                <input type="text" placeholder="Search..." />
              </SearchBar>
              <ActionButton hasNotifications={true}>
                <Bell />
              </ActionButton>
              <ProfileButton>
                <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="Profile" />
                <span>{centerData.admin}</span>
                <ChevronDown />
              </ProfileButton>
            </HeaderActions>
          </DashboardHeader>

          <StatsGrid>
            <StatCard>
              <StatHeader bgColor="#FFF0F0" iconColor="#FF6B6B">
                <h3>Available Pets</h3>
                <div className="icon">
                  <PawPrint />
                </div>
              </StatHeader>
              <StatValue>{centerData.stats.availablePets}</StatValue>
              <StatChange isPositive={centerData.stats.availablePetsChange.startsWith("+")}>
                {centerData.stats.availablePetsChange} from last month
              </StatChange>
            </StatCard>

            <StatCard>
              <StatHeader bgColor="#E8F5E9" iconColor="#4CAF50">
                <h3>Adopted Pets</h3>
                <div className="icon">
                  <CheckCircle />
                </div>
              </StatHeader>
              <StatValue>{centerData.stats.adoptedPets}</StatValue>
              <StatChange isPositive={centerData.stats.adoptedPetsChange.startsWith("+")}>
                {centerData.stats.adoptedPetsChange} from last month
              </StatChange>
            </StatCard>

            <StatCard>
              <StatHeader bgColor="#FFF8E1" iconColor="#FFC107">
                <h3>Pending Applications</h3>
                <div className="icon">
                  <FileText />
                </div>
              </StatHeader>
              <StatValue>{centerData.stats.pendingApplications}</StatValue>
              <StatChange isPositive={centerData.stats.pendingApplicationsChange.startsWith("+")}>
                {centerData.stats.pendingApplicationsChange} from last month
              </StatChange>
            </StatCard>

            <StatCard>
              <StatHeader bgColor="#E3F2FD" iconColor="#2196F3">
                <h3>Total Applications</h3>
                <div className="icon">
                  <Users />
                </div>
              </StatHeader>
              <StatValue>{centerData.stats.totalApplications}</StatValue>
              <StatChange isPositive={centerData.stats.totalApplicationsChange.startsWith("+")}>
                {centerData.stats.totalApplicationsChange} from last month
              </StatChange>
            </StatCard>
          </StatsGrid>

          <SectionHeader>
            <SectionTitle>Recent Pets</SectionTitle>
            <ViewAllLink
              href="#"
              onClick={(e) => {
                e.preventDefault()
                setActiveTab("pets")
              }}
            >
              View all pets
            </ViewAllLink>
          </SectionHeader>

          <PetsGrid>
            {centerData.pets.map((pet) => (
              <PetCard key={pet.id}>
                <PetImage>
                  <img src={pet.image || "/placeholder.svg"} alt={pet.name} />
                </PetImage>
                <PetInfo>
                  <PetName>{pet.name}</PetName>
                  <PetDetails>
                    <PetDetail>
                      Age: <span>{pet.age}</span>
                    </PetDetail>
                    <PetDetail>
                      Breed: <span>{pet.breed}</span>
                    </PetDetail>
                  </PetDetails>
                  <PetStatus adopted={pet.adopted}>
                    {pet.adopted ? (
                      <>
                        <CheckCircle /> Adopted
                      </>
                    ) : (
                      <>
                        <PawPrint /> Available
                      </>
                    )}
                  </PetStatus>
                </PetInfo>
              </PetCard>
            ))}
          </PetsGrid>

          <AddPetButton>
            <PlusCircle />
          </AddPetButton>
        </Content>
      </MainContainer>
    </PageWrapper>
  )
}

export default AdoptionCenterDashboard

