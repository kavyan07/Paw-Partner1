import React, { useState, useEffect } from "react"
import styled from "styled-components"
import axios from "axios"
import { toast } from "react-toastify"
import { Store, Package, Phone, MapPin, Search, Filter, ShoppingBag } from "lucide-react"

const PetShopContainer = styled.div`
  min-height: 100vh;
  background-color: #f8f9fa;
  padding: 2rem;
`

const HeaderSection = styled.div`
  max-width: 1200px;
  margin: 0 auto 2rem;
  text-align: center;
`

const Title = styled.h1`
  font-size: 2.5rem;
  color: #333;
  margin-bottom: 1rem;
  
  &:after {
    content: '';
    display: block;
    width: 50px;
    height: 3px;
    background: #FF6B6B;
    margin: 1rem auto;
  }
`

const SearchBar = styled.div`
  display: flex;
  gap: 1rem;
  max-width: 600px;
  margin: 2rem auto;
`

const SearchInput = styled.input`
  flex: 1;
  padding: 0.8rem 1.5rem;
  border: 2px solid #e0e0e0;
  border-radius: 50px;
  font-size: 1rem;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: #FF6B6B;
    box-shadow: 0 0 0 2px rgba(255, 107, 107, 0.1);
  }
`

const FilterButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.8rem 1.5rem;
  border: none;
  border-radius: 50px;
  background: #FF6B6B;
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: #ff5252;
    transform: translateY(-2px);
  }
`

const ShopGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
`

const ShopCard = styled.div`
  background: white;
  border-radius: 15px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-5px);
  }
`

const ShopImage = styled.img`
  width: 100%;
  height: 200px;
  object-fit: cover;
`

const ShopInfo = styled.div`
  padding: 1.5rem;
`

const ShopName = styled.h3`
  font-size: 1.5rem;
  color: #333;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`

const ShopDetail = styled.p`
  color: #666;
  margin: 0.5rem 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  svg {
    color: #FF6B6B;
  }
`

const ItemsSection = styled.div`
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #eee;
`

const ItemsTitle = styled.h4`
  font-size: 1.1rem;
  color: #333;
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`

const ItemsList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
  gap: 0.5rem;
  margin-top: 0.5rem;
`

const ItemThumb = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 8px;
  background-image: url(${props => props.image});
  background-size: cover;
  background-position: center;
  cursor: pointer;
  transition: transform 0.2s ease;

  &:hover {
    transform: scale(1.05);
  }
`

const LoadingSpinner = styled.div`
  text-align: center;
  padding: 2rem;
  color: #FF6B6B;
  font-size: 1.2rem;
`

const ErrorMessage = styled.div`
  text-align: center;
  padding: 2rem;
  color: #dc3545;
  font-size: 1.2rem;
`

const NoResults = styled.div`
  text-align: center;
  padding: 4rem 2rem;
  color: #666;
  font-size: 1.2rem;

  svg {
    color: #FF6B6B;
    margin-bottom: 1rem;
  }
`

function PetShop() {
  const [shops, setShops] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    fetchPetShops()
  }, [])

  const fetchPetShops = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await axios.get('http://localhost:8000/api/v1/pet-shops/', {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      })

      if (response.data?.data) {
        setShops(response.data.data)
      } else {
        throw new Error("Invalid data format received from the server")
      }
    } catch (error) {
      console.error("Error fetching pet shops:", error)
      const errorMessage = error.response?.data?.message || "Failed to fetch pet shops. Please try again later."
      setError(errorMessage)
      toast.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const filteredShops = shops.filter(shop =>
    shop.shopName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    shop.address.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) {
    return <LoadingSpinner>Loading pet shops...</LoadingSpinner>
  }

  if (error) {
    return <ErrorMessage>{error}</ErrorMessage>
  }

  return (
    <PetShopContainer>
      <HeaderSection>
        <Title>Pet Shops</Title>
        <SearchBar>
          <SearchInput
            type="text"
            placeholder="Search pet shops by name or location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <FilterButton>
            <Filter size={18} />
            Filter
          </FilterButton>
        </SearchBar>
      </HeaderSection>

      {filteredShops.length === 0 ? (
        <NoResults>
          <Store size={48} />
          <p>No pet shops found matching your search.</p>
        </NoResults>
      ) : (
        <ShopGrid>
          {filteredShops.map((shop) => (
            <ShopCard key={shop._id}>
              <ShopImage 
                src={shop.imageUrl || "https://res.cloudinary.com/dd2y1lxsf/image/upload/v1737739026/shop_default_axzvoi.jpg"} 
                alt={shop.shopName} 
              />
              <ShopInfo>
                <ShopName>
                  <Store size={24} color="#FF6B6B" />
                  {shop.shopName}
                </ShopName>
                <ShopDetail>
                  <Package size={18} />
                  Products available
                </ShopDetail>
                <ShopDetail>
                  <Phone size={18} />
                  {shop.contact}
                </ShopDetail>
                <ShopDetail>
                  <MapPin size={18} />
                  {shop.address}
                </ShopDetail>

                <ItemsSection>
                  <ItemsTitle>
                    <ShoppingBag size={18} color="#FF6B6B" />
                    Featured Items
                  </ItemsTitle>
                  <ItemsList>
                    {shop.items?.slice(0, 4).map((item) => (
                      <ItemThumb 
                        key={item._id}
                        image={item.imageUrl}
                        title={item.name}
                      />
                    ))}
                  </ItemsList>
                </ItemsSection>
              </ShopInfo>
            </ShopCard>
          ))}
        </ShopGrid>
      )}
    </PetShopContainer>
  )
}

export default PetShop