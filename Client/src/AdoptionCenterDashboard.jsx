"use client"

import { useState, useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import styled from "styled-components"
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
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
  TrendingUp,
  TrendingDown,
  Edit,
  Trash2,
  XIcon,
  Loader,
} from "lucide-react"

const PageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: #f8fafc;
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
`

const MainContainer = styled.div`
  display: flex;
  flex: 1;
`

const Sidebar = styled.aside`
  width: 280px;
  background: white;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  z-index: 100;
  transition: all 0.3s ease;
  overflow-y: auto;
  border-right: 1px solid #e2e8f0;
  
  @media (max-width: 992px) {
    transform: ${(props) => (props.isOpen ? "translateX(0)" : "translateX(-100%)")};
  }
`

const SidebarHeader = styled.div`
  padding: 25px 25px 20px;
  border-bottom: 1px solid #e2e8f0;
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
    color: #1a202c;
    margin: 0;
  }
`

const CenterName = styled.h2`
  font-size: 1rem;
  color: #4a5568;
  margin: 0;
  font-weight: 500;
`

const NavMenu = styled.nav`
  margin-top: 20px;
  padding: 0 15px;
`

const NavSection = styled.div`
  margin-bottom: 20px;
`

const NavSectionTitle = styled.h3`
  font-size: 0.75rem;
  text-transform: uppercase;
  color: #718096;
  margin: 15px 10px 10px;
  letter-spacing: 0.05em;
  font-weight: 600;
`

const NavItem = styled.a`
  display: flex;
  align-items: center;
  padding: 12px 15px;
  color: ${(props) => (props.active ? "#FF6B6B" : "#4a5568")};
  text-decoration: none;
  transition: all 0.2s ease;
  border-radius: 8px;
  margin-bottom: 5px;
  background: ${(props) => (props.active ? "#FFF0F0" : "transparent")};
  font-weight: ${(props) => (props.active ? "600" : "500")};
  font-size: 0.9rem;
  
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
  color: #4a5568;
  background: none;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
  width: 100%;
  text-align: left;
  font-size: 0.9rem;
  border-radius: 8px;
  margin: 10px 0;
  font-weight: 500;
  
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
  max-width: 1600px;

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
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  position: sticky;
  top: 0;
  z-index: 99;
  border-bottom: 1px solid #e2e8f0;

  @media (max-width: 992px) {
    display: flex;
  }
`

const MenuButton = styled.button`
  background: none;
  border: none;
  color: #4a5568;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px;
  border-radius: 8px;
  transition: all 0.2s ease;
  
  &:hover {
    background: #f7fafc;
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
    color: #1a202c;
    margin: 0;
  }
`

const DashboardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  background: white;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
`

const PageTitle = styled.h1`
  font-size: 1.8rem;
  color: #1a202c;
  margin: 0;
  font-weight: 700;
`

const HeaderActions = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
`

const SearchBar = styled.div`
  position: relative;
  width: 300px;
  
  @media (max-width: 768px) {
    display: none;
  }
  
  input {
    width: 100%;
    padding: 10px 15px 10px 40px;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    font-size: 0.9rem;
    transition: all 0.2s ease;
    background: #f7fafc;
    
    &:focus {
      outline: none;
      border-color: #FF6B6B;
      box-shadow: 0 0 0 3px rgba(255, 107, 107, 0.1);
      background: white;
    }
  }
  
  svg {
    position: absolute;
    left: 12px;
    top: 50%;
    transform: translateY(-50%);
    color: #718096;
    width: 18px;
    height: 18px;
  }
`

const ActionButton = styled.button`
  background: white;
  border: 1px solid #e2e8f0;
  width: 40px;
  height: 40px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  position: relative;
  transition: all 0.2s ease;
  
  &:hover {
    border-color: #FF6B6B;
    transform: translateY(-2px);
  }
  
  svg {
    color: #4a5568;
    width: 18px;
    height: 18px;
  }

  &::after {
    content: '';
    position: absolute;
    top: -2px;
    right: -2px;
    width: 8px;
    height: 8px;
    background: #FF6B6B;
    border: 2px solid white;
    border-radius: 50%;
    display: ${(props) => (props.hasNotifications ? "block" : "none")};
  }
`

const ProfileButton = styled.button`
  background: white;
  border: 1px solid #e2e8f0;
  padding: 6px 12px 6px 6px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    border-color: #FF6B6B;
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
    color: #1a202c;
    font-size: 0.9rem;
  }

  svg {
    color: #4a5568;
    width: 16px;
    height: 16px;
  }
`

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
`

const StatCard = styled.div`
  background: white;
  border-radius: 12px;
  padding: 25px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  border: 1px solid #e2e8f0;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
    border-color: #FF6B6B;
  }
`

const StatHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 15px;

  h3 {
    font-size: 0.9rem;
    color: #718096;
    margin: 0;
    font-weight: 500;
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
  font-size: 2rem;
  font-weight: 700;
  color: #1a202c;
  margin-bottom: 5px;
`

const StatChange = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 0.85rem;
  color: ${(props) => (props.isPositive ? "#48bb78" : "#f56565")};
  font-weight: 500;
  
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
  padding: 0 10px;
`

const SectionTitle = styled.h2`
  font-size: 1.4rem;
  color: #1a202c;
  margin: 0;
  font-weight: 700;
`

const ViewAllLink = styled.a`
  color: #FF6B6B;
  text-decoration: none;
  font-size: 0.9rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 8px 16px;
  border-radius: 8px;
  transition: all 0.2s ease;
  
  &:hover {
    background: #FFF0F0;
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
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  border: 1px solid #e2e8f0;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
    border-color: #FF6B6B;
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
  margin: 0 0 10px;
  color: #1a202c;
  font-weight: 600;
`

const PetDetails = styled.div`
  display: flex;
  gap: 15px;
  margin-bottom: 15px;
`

const PetDetail = styled.div`
  font-size: 0.9rem;
  color: #718096;
  
  span {
    font-weight: 500;
    color: #4a5568;
  }
`

const PetStatus = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-size: 0.85rem;
  color: ${(props) => (props.adopted ? "#48bb78" : "#FF6B6B")};
  font-weight: 600;
  padding: 6px 12px;
  border-radius: 6px;
  background: ${(props) => (props.adopted ? "#f0fff4" : "#FFF0F0")};
  
  svg {
    width: 14px;
    height: 14px;
  }
`

const PetActions = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 15px;
`

const PetActionButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  padding: 8px 12px;
  border-radius: 6px;
  font-size: 0.85rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  border: 1px solid #e2e8f0;
  background: ${(props) => (props.danger ? "#FFF5F5" : "white")};
  color: ${(props) => (props.danger ? "#f56565" : "#4a5568")};
  
  &:hover {
    background: ${(props) => (props.danger ? "#FED7D7" : "#f7fafc")};
    border-color: ${(props) => (props.danger ? "#f56565" : "#FF6B6B")};
    transform: translateY(-2px);
  }
  
  svg {
    width: 14px;
    height: 14px;
  }
`

const AddPetButton = styled.button`
  position: fixed;
  bottom: 30px;
  right: 30px;
  width: 56px;
  height: 56px;
  border-radius: 28px;
  background: #FF6B6B;
  color: white;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(255, 107, 107, 0.3);
  transition: all 0.3s ease;
  z-index: 90;
  
  &:hover {
    background: #FF5252;
    transform: scale(1.1);
    box-shadow: 0 6px 16px rgba(255, 107, 107, 0.4);
  }
  
  svg {
    width: 24px;
    height: 24px;
  }
`

const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  padding: 20px;
`

const ModalContent = styled.div`
  background: white;
  border-radius: 12px;
  width: 100%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  position: relative;
`

const ModalHeader = styled.div`
  padding: 20px;
  border-bottom: 1px solid #e2e8f0;
  display: flex;
  justify-content: space-between;
  align-items: center;
`

const ModalTitle = styled.h3`
  margin: 0;
  font-size: 1.2rem;
  font-weight: 600;
  color: #1a202c;
`

const CloseButton = styled.button`
  background: none;
  border: none;
  color: #718096;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px;
  border-radius: 8px;
  transition: all 0.2s ease;
  
  &:hover {
    background: #f7fafc;
    color: #f56565;
  }
  
  svg {
    width: 20px;
    height: 20px;
  }
`

const ModalBody = styled.div`
  padding: 20px;
`

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 15px;
`

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
`

const Label = styled.label`
  font-size: 0.9rem;
  font-weight: 500;
  color: #4a5568;
`

const Input = styled.input`
  padding: 10px 15px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 0.9rem;
  transition: all 0.2s ease;
  
  &:focus {
    outline: none;
    border-color: #FF6B6B;
    box-shadow: 0 0 0 3px rgba(255, 107, 107, 0.1);
  }
`

const Select = styled.select`
  padding: 10px 15px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 0.9rem;
  transition: all 0.2s ease;
  
  &:focus {
    outline: none;
    border-color: #FF6B6B;
    box-shadow: 0 0 0 3px rgba(255, 107, 107, 0.1);
  }
`

const TextArea = styled.textarea`
  padding: 10px 15px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 0.9rem;
  transition: all 0.2s ease;
  min-height: 100px;
  resize: vertical;
  
  &:focus {
    outline: none;
    border-color: #FF6B6B;
    box-shadow: 0 0 0 3px rgba(255, 107, 107, 0.1);
  }
`

const ModalFooter = styled.div`
  padding: 15px 20px;
  border-top: 1px solid #e2e8f0;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
`

const Button = styled.button`
  padding: 10px 16px;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  
  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
  
  svg {
    width: 16px;
    height: 16px;
  }
`

const PrimaryButton = styled(Button)`
  background: #FF6B6B;
  color: white;
  border: none;
  
  &:hover:not(:disabled) {
    background: #FF5252;
    transform: translateY(-2px);
  }
`

const SecondaryButton = styled(Button)`
  background: white;
  color: #4a5568;
  border: 1px solid #e2e8f0;
  
  &:hover:not(:disabled) {
    background: #f7fafc;
    transform: translateY(-2px);
  }
`

const ErrorMessage = styled.div`
  color: #f56565;
  font-size: 0.85rem;
  margin-top: 5px;
`

const EmptyState = styled.div`
  text-align: center;
  padding: 40px 20px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  border: 1px solid #e2e8f0;
`

const EmptyStateIcon = styled.div`
  margin-bottom: 20px;
  
  svg {
    width: 60px;
    height: 60px;
    color: #CBD5E0;
  }
`

const EmptyStateTitle = styled.h3`
  font-size: 1.2rem;
  color: #1a202c;
  margin: 0 0 10px;
  font-weight: 600;
`

const EmptyStateText = styled.p`
  color: #718096;
  margin: 0 0 20px;
`

function AdoptionCenterDashboard() {
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("dashboard")
  const [pets, setPets] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [stats, setStats] = useState({
    availablePets: 0,
    adoptedPets: 0,
    pendingApplications: 0,
    totalApplications: 0,
  })

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalMode, setModalMode] = useState("add") // "add" or "edit"
  const [selectedPet, setSelectedPet] = useState(null)
  const [formErrors, setFormErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    type: "",
    breed: "",
    age: "",
    gender: "",
    description: "",
    image: null,
  })

  const fileInputRef = useRef(null)

  // Get user data from localStorage
  const userDataString = localStorage.getItem("user")
  const userData = userDataString ? JSON.parse(userDataString) : null
  const adoptionCenterName = userData?.adoptionCenterName || "Your Adoption Center"
  const adminName = userData?.username || "Admin"
  const token = localStorage.getItem("token")

  useEffect(() => {
    // Check if user is logged in
    const userRole = localStorage.getItem("userRole")

    if (!token || userRole !== "adoptionCenter") {
      navigate("/signin")
      return
    }

    fetchPets()
  }, [navigate])

  const fetchPets = async () => {
    try {
      setLoading(true)
      setError(null)

      // Get the adoption center ID from user data
      const centerId = userData?._id

      if (!centerId) {
        throw new Error("Adoption center ID not found")
      }

      const response = await axios.get(`http://localhost:8000/api/v1/adoption-center-pets/${centerId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.data && response.data.statusCode === 200) {
        setPets(response.data.data || [])

        // Calculate stats
        const availablePets = response.data.data.length || 0
        // For demo purposes, we'll set some mock stats
        setStats({
          availablePets,
          adoptedPets: Math.floor(availablePets * 0.7), // Mock data
          pendingApplications: Math.floor(availablePets * 0.3), // Mock data
          totalApplications: Math.floor(availablePets * 1.2), // Mock data
        })
      } else {
        throw new Error("Failed to fetch pets")
      }
    } catch (error) {
      console.error("Error fetching pets:", error)
      setError(error.message || "Failed to fetch pets")
      toast.error("Failed to fetch pets")
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("userRole")
    localStorage.removeItem("user")
    navigate("/signin")
  }

  const openAddPetModal = () => {
    setModalMode("add")
    setSelectedPet(null)
    setFormData({
      name: "",
      type: "",
      breed: "",
      age: "",
      gender: "",
      description: "",
      image: null,
    })
    setFormErrors({})
    setIsModalOpen(true)
  }

  const openEditPetModal = (pet) => {
    setModalMode("edit")
    setSelectedPet(pet)
    setFormData({
      name: pet.name,
      type: pet.type,
      breed: pet.breed,
      age: pet.age.toString(),
      gender: pet.gender,
      description: pet.description,
      image: null,
    })
    setFormErrors({})
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
  }

  const handleInputChange = (e) => {
    const { name, value, files } = e.target

    if (name === "image" && files && files[0]) {
      setFormData((prev) => ({
        ...prev,
        image: files[0],
      }))
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }))
    }

    // Clear error for this field if it exists
    if (formErrors[name]) {
      setFormErrors((prev) => ({
        ...prev,
        [name]: null,
      }))
    }
  }

  const validateForm = () => {
    const errors = {}

    if (!formData.name.trim()) errors.name = "Name is required"
    if (!formData.type) errors.type = "Type is required"
    if (!formData.breed.trim()) errors.breed = "Breed is required"
    if (!formData.age.trim()) errors.age = "Age is required"
    else if (isNaN(formData.age) || Number.parseInt(formData.age) < 0) errors.age = "Age must be a positive number"
    if (!formData.gender) errors.gender = "Gender is required"
    if (!formData.description.trim()) errors.description = "Description is required"

    // Image is required only for new pets
    if (modalMode === "add" && !formData.image) errors.image = "Image is required"

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsSubmitting(true)

    try {
      const formDataToSend = new FormData()
      formDataToSend.append("name", formData.name)
      formDataToSend.append("type", formData.type)
      formDataToSend.append("breed", formData.breed)
      formDataToSend.append("age", formData.age)
      formDataToSend.append("gender", formData.gender)
      formDataToSend.append("description", formData.description)

      if (formData.image) {
        formDataToSend.append("image", formData.image)
      }

      let response

      if (modalMode === "add") {
        response = await axios.post("http://localhost:8000/api/v1/adoption-center-pets/add", formDataToSend, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        })

        toast.success("Pet added successfully")
      } else {
        response = await axios.patch(
          `http://localhost:8000/api/v1/adoption-center-pets/update/${selectedPet._id}`,
          formDataToSend,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          },
        )

        toast.success("Pet updated successfully")
      }

      // Refresh pets list
      fetchPets()
      closeModal()
    } catch (error) {
      console.error("Error saving pet:", error)
      toast.error(error.response?.data?.message || "Failed to save pet")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeletePet = async (petId) => {
    if (!window.confirm("Are you sure you want to delete this pet?")) return

    try {
      await axios.delete(`http://localhost:8000/api/v1/adoption-center-pets/delete/${petId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      toast.success("Pet deleted successfully")
      fetchPets()
    } catch (error) {
      console.error("Error deleting pet:", error)
      toast.error(error.response?.data?.message || "Failed to delete pet")
    }
  }

  const renderPetsList = () => {
    if (loading) {
      return (
        <EmptyState>
          <EmptyStateIcon>
            <Loader />
          </EmptyStateIcon>
          <EmptyStateTitle>Loading pets...</EmptyStateTitle>
        </EmptyState>
      )
    }

    if (error) {
      return (
        <EmptyState>
          <EmptyStateIcon>
            <XIcon />
          </EmptyStateIcon>
          <EmptyStateTitle>Error loading pets</EmptyStateTitle>
          <EmptyStateText>{error}</EmptyStateText>
          <PrimaryButton onClick={fetchPets}>Try Again</PrimaryButton>
        </EmptyState>
      )
    }

    if (pets.length === 0) {
      return (
        <EmptyState>
          <EmptyStateIcon>
            <PawPrint />
          </EmptyStateIcon>
          <EmptyStateTitle>No pets found</EmptyStateTitle>
          <EmptyStateText>Add your first pet to get started</EmptyStateText>
          <PrimaryButton onClick={openAddPetModal}>Add Pet</PrimaryButton>
        </EmptyState>
      )
    }

    return (
      <PetsGrid>
        {pets.map((pet) => (
          <PetCard key={pet._id}>
            <PetImage>
              <img src={pet.imageUrl || "/placeholder.svg?height=200&width=300"} alt={pet.name} />
            </PetImage>
            <PetInfo>
              <PetName>{pet.name}</PetName>
              <PetDetails>
                <PetDetail>
                  Age: <span>{pet.age} years</span>
                </PetDetail>
                <PetDetail>
                  Breed: <span>{pet.breed}</span>
                </PetDetail>
              </PetDetails>
              <PetStatus>
                <PawPrint /> {pet.type}
              </PetStatus>
              <PetActions>
                <PetActionButton onClick={() => openEditPetModal(pet)}>
                  <Edit /> Edit
                </PetActionButton>
                <PetActionButton danger onClick={() => handleDeletePet(pet._id)}>
                  <Trash2 /> Delete
                </PetActionButton>
              </PetActions>
            </PetInfo>
          </PetCard>
        ))}
      </PetsGrid>
    )
  }

  return (
    <PageWrapper>
      <ToastContainer position="top-right" />
      <MainContainer>
        {/* Mobile Top Bar */}
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
            <CenterName>{adoptionCenterName}</CenterName>
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

        {/* Main Content */}
        <Content>
          <DashboardHeader>
            <PageTitle>Dashboard</PageTitle>
            <HeaderActions>
              <SearchBar>
                <Search />
                <input type="text" placeholder="Search pets..." />
              </SearchBar>
              <ActionButton hasNotifications={true}>
                <Bell />
              </ActionButton>
              <ProfileButton>
                <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="Profile" />
                <span>{adminName}</span>
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
              <StatValue>{stats.availablePets}</StatValue>
              <StatChange isPositive={true}>
                <TrendingUp />+{Math.floor(stats.availablePets * 0.1)} from last month
              </StatChange>
            </StatCard>

            <StatCard>
              <StatHeader bgColor="#E8F5E9" iconColor="#48bb78">
                <h3>Adopted Pets</h3>
                <div className="icon">
                  <CheckCircle />
                </div>
              </StatHeader>
              <StatValue>{stats.adoptedPets}</StatValue>
              <StatChange isPositive={true}>
                <TrendingUp />+{Math.floor(stats.adoptedPets * 0.15)} from last month
              </StatChange>
            </StatCard>

            <StatCard>
              <StatHeader bgColor="#FFF8E1" iconColor="#ECC94B">
                <h3>Pending Applications</h3>
                <div className="icon">
                  <FileText />
                </div>
              </StatHeader>
              <StatValue>{stats.pendingApplications}</StatValue>
              <StatChange isPositive={false}>
                <TrendingDown />-{Math.floor(stats.pendingApplications * 0.05)} from last month
              </StatChange>
            </StatCard>

            <StatCard>
              <StatHeader bgColor="#E3F2FD" iconColor="#4299E1">
                <h3>Total Applications</h3>
                <div className="icon">
                  <Users />
                </div>
              </StatHeader>
              <StatValue>{stats.totalApplications}</StatValue>
              <StatChange isPositive={true}>
                <TrendingUp />+{Math.floor(stats.totalApplications * 0.08)} from last month
              </StatChange>
            </StatCard>
          </StatsGrid>

          <SectionHeader>
            <SectionTitle>Manage Pets</SectionTitle>
            <ViewAllLink href="#" onClick={openAddPetModal}>
              Add New Pet
            </ViewAllLink>
          </SectionHeader>

          {renderPetsList()}

          <AddPetButton onClick={openAddPetModal}>
            <PlusCircle />
          </AddPetButton>
        </Content>
      </MainContainer>

      {/* Add/Edit Pet Modal */}
      {isModalOpen && (
        <Modal>
          <ModalContent>
            <ModalHeader>
              <ModalTitle>{modalMode === "add" ? "Add New Pet" : "Edit Pet"}</ModalTitle>
              <CloseButton onClick={closeModal}>
                <X />
              </CloseButton>
            </ModalHeader>
            <ModalBody>
              <Form onSubmit={handleSubmit}>
                <FormGroup>
                  <Label htmlFor="name">Pet Name</Label>
                  <Input type="text" id="name" name="name" value={formData.name} onChange={handleInputChange} />
                  {formErrors.name && <ErrorMessage>{formErrors.name}</ErrorMessage>}
                </FormGroup>

                <FormGroup>
                  <Label htmlFor="type">Pet Type</Label>
                  <Select id="type" name="type" value={formData.type} onChange={handleInputChange}>
                    <option value="">Select pet type</option>
                    <option value="Dog">Dog</option>
                    <option value="Cat">Cat</option>
                    <option value="Bird">Bird</option>
                    <option value="Fish">Fish</option>
                    <option value="Other">Other</option>
                  </Select>
                  {formErrors.type && <ErrorMessage>{formErrors.type}</ErrorMessage>}
                </FormGroup>

                <FormGroup>
                  <Label htmlFor="breed">Breed</Label>
                  <Input type="text" id="breed" name="breed" value={formData.breed} onChange={handleInputChange} />
                  {formErrors.breed && <ErrorMessage>{formErrors.breed}</ErrorMessage>}
                </FormGroup>

                <FormGroup>
                  <Label htmlFor="age">Age (years)</Label>
                  <Input
                    type="number"
                    id="age"
                    name="age"
                    value={formData.age}
                    onChange={handleInputChange}
                    min="0"
                    step="0.1"
                  />
                  {formErrors.age && <ErrorMessage>{formErrors.age}</ErrorMessage>}
                </FormGroup>

                <FormGroup>
                  <Label htmlFor="gender">Gender</Label>
                  <Select id="gender" name="gender" value={formData.gender} onChange={handleInputChange}>
                    <option value="">Select gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </Select>
                  {formErrors.gender && <ErrorMessage>{formErrors.gender}</ErrorMessage>}
                </FormGroup>

                <FormGroup>
                  <Label htmlFor="description">Description</Label>
                  <TextArea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                  />
                  {formErrors.description && <ErrorMessage>{formErrors.description}</ErrorMessage>}
                </FormGroup>

                <FormGroup>
                  <Label htmlFor="image">Pet Image</Label>
                  <Input
                    type="file"
                    id="image"
                    name="image"
                    onChange={handleInputChange}
                    accept="image/*"
                    ref={fileInputRef}
                  />
                  {formErrors.image && <ErrorMessage>{formErrors.image}</ErrorMessage>}
                </FormGroup>
              </Form>
            </ModalBody>
            <ModalFooter>
              <SecondaryButton onClick={closeModal}>Cancel</SecondaryButton>
              <PrimaryButton onClick={handleSubmit} disabled={isSubmitting}>
                {isSubmitting ? <Loader /> : modalMode === "add" ? "Add Pet" : "Update Pet"}
              </PrimaryButton>
            </ModalFooter>
          </ModalContent>
        </Modal>
      )}
    </PageWrapper>
  )
}

export default AdoptionCenterDashboard

