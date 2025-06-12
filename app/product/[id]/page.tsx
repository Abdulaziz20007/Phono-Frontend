"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import styled from "styled-components";
import Image from "next/image";
import { api, Product } from "@/api/api";
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import toast from "react-hot-toast";
import { useUser } from "@/context/UserContext";

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  background-color: #f9f9f9;
`;

const Breadcrumbs = styled.div`
  display: flex;
  font-size: 14px;
  margin-bottom: 15px;
  color: #757575;

  a {
    margin-right: 5px;
    text-decoration: none;
    color: #757575;
    &:hover {
      text-decoration: underline;
    }
  }

  span {
    margin: 0 5px;
  }
`;

const ProductContainer = styled.div`
  display: flex;
  flex-direction: column;
  background: white;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  padding: 20px;
`;

const ProductContentContainer = styled.div`
  display: flex;
  flex-direction: row;
  gap: 20px;
  width: 100%;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const LeftColumn = styled.div`
  flex: 1;
`;

const RightColumn = styled.div`
  flex: 1;
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 300px;
  font-size: 18px;
  color: #666;
`;

const ErrorContainer = styled.div`
  background-color: #ffecef;
  color: #d32f2f;
  padding: 20px;
  border-radius: 8px;
  margin: 20px 0;
`;

const ProductTitle = styled.h1`
  font-size: 28px;
  margin: 0 0 15px 0;
  font-weight: 500;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
`;

const ProductStatusLabel = styled.span<{
  $status: "archived" | "sold" | "waiting" | "active";
}>`
  display: inline-flex;
  align-items: center;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 500;

  ${({ $status }) => {
    switch ($status) {
      case "archived":
        return `
          background-color: #f0f0f0;
          color: #757575;
          border: 1px solid #e0e0e0;
        `;
      case "sold":
        return `
          background-color: #ffebee;
          color: #d32f2f;
          border: 1px solid #ffcdd2;
        `;
      case "waiting":
        return `
          background-color: #fff8e1;
          color: #f57f17;
          border: 1px solid #ffe0b2;
        `;
      default:
        return `
          display: none;
        `;
    }
  }}
`;

const TopRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const FavoriteButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;

  svg {
    width: 24px;
    height: 24px;
    fill: transparent;
    stroke: #888;
    stroke-width: 1.5px;

    &:hover {
      stroke: #6247aa;
    }
  }

  &.active svg {
    fill: #f44336;
    stroke: #f44336;
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.7;
  }
`;

const Price = styled.div`
  font-size: 26px;
  font-weight: 600;
  color: #333;
  margin: 10px 0;
  display: flex;
  align-items: center;
`;

const PriceTag = styled.span`
  font-size: 14px;
  font-weight: 500;
  color: white;
  background-color: #6ddc6d;
  padding: 4px 8px;
  border-radius: 4px;
  margin-left: 12px;
`;

const LocationInfo = styled.div`
  display: flex;
  align-items: center;
  margin: 15px 0;
  color: #666;
  font-size: 14px;

  svg {
    margin-right: 8px;
  }
`;

const ActionsContainer = styled.div`
  display: flex;
  gap: 15px;
  margin: 20px 0;
`;

const ActionButton = styled.button<{ $primary?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px 20px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  flex: 1;

  ${(props) =>
    props.$primary
      ? `
    background-color: #6247AA;
    color: white;
    border: none;
    
    &:hover {
      background-color: #533d90;
    }
  `
      : `
    background-color: white;
    color: #6247AA;
    border: 1.5px solid #6247AA;
    
    &:hover {
      background-color: #f0ebf8;
    }
  `}

  svg {
    margin-right: 8px;
  }
`;

const SpecsContainer = styled.div`
  margin-top: 20px;
`;

const SpecRow = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 12px 0;
  border-bottom: 1px solid #eee;

  &:last-child {
    border-bottom: none;
  }
`;

const SpecLabel = styled.div`
  color: #757575;
`;

const SpecValue = styled.div`
  font-weight: 500;
  display: flex;
  align-items: center;

  &.blue-dot::before {
    content: "";
    display: inline-block;
    width: 10px;
    height: 10px;
    border-radius: 50%;
    margin-right: 8px;
    background-color: var(--dot-color);
  }
`;

const PostedInfo = styled.div`
  margin-top: 20px;
  font-size: 14px;
  color: #757575;
  display: flex;
  justify-content: space-between;
`;

const ViewsCount = styled.div`
  display: flex;
  align-items: center;

  svg {
    margin-right: 5px;
  }
`;

const ImageGallery = styled.div`
  position: relative;
  margin-bottom: 20px;
`;

const MainImageContainer = styled.div`
  position: relative;
  height: 400px;
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: 10px;
`;

const ThumbsContainer = styled.div`
  display: flex;
  gap: 10px;
  overflow-x: auto;
  padding-bottom: 5px;

  &::-webkit-scrollbar {
    height: 4px;
  }

  &::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background: #888;
    border-radius: 4px;
  }
`;

const ThumbImageContainer = styled.div<{ $active?: boolean }>`
  position: relative;
  width: 80px;
  height: 80px;
  border-radius: 4px;
  overflow: hidden;
  cursor: pointer;
  flex-shrink: 0;
  border: ${(props) =>
    props.$active ? "2px solid #6247AA" : "2px solid transparent"};
`;

const StyledImage = styled(Image)`
  object-fit: cover;
`;

const NavigationButton = styled.button<{ direction: "prev" | "next" }>`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  ${(props) => (props.direction === "prev" ? "left: 10px;" : "right: 10px;")}
  background-color: rgba(255, 255, 255, 0.7);
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

  &:hover {
    background-color: rgba(255, 255, 255, 0.9);
  }
`;

const MapContainer = styled.div`
  width: 100%;
  height: 300px;
  margin-top: 20px;
  border-radius: 8px;
  overflow: hidden;
  display: block;
  position: relative;
`;

const TabsContainer = styled.div`
  display: flex;
  border-bottom: 1px solid #e0e0e0;
  margin: 30px 0 20px;
`;

const Tab = styled.button<{ $isActive?: boolean }>`
  padding: 12px 20px;
  background: none;
  border: none;
  border-bottom: 2px solid
    ${(props) => (props.$isActive ? "#6247AA" : "transparent")};
  color: ${(props) => (props.$isActive ? "#333" : "#757575")};
  font-weight: ${(props) => (props.$isActive ? "500" : "normal")};
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    color: #333;
  }
`;

const TabContent = styled.div<{ $isVisible?: boolean }>`
  display: ${(props) => (props.$isVisible ? "block" : "none")};
  padding: 20px 0;
  line-height: 1.6;
`;

const DescriptionText = styled.p`
  margin: 0;
  color: #333;
  line-height: 1.6;
  white-space: pre-wrap;
`;

const CommentContainer = styled.div`
  border-bottom: 1px solid #f0f0f0;
  padding: 15px 0;
`;

const CommentHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 10px;
`;

const CommentAvatar = styled.div`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background-color: #e0e0e0;
  margin-right: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #757575;
  font-weight: 500;
`;

const CommentAuthor = styled.div`
  font-weight: 500;
  color: #333;
`;

const CommentText = styled.p`
  margin: 0;
  color: #333;
`;

const CommentForm = styled.form`
  margin: 20px 0;
  display: flex;
  flex-direction: column;
`;

const CommentTextArea = styled.textarea`
  width: 100%;
  min-height: 80px;
  padding: 12px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  resize: vertical;
  font-family: inherit;
  font-size: 14px;
  margin-bottom: 10px;

  &:focus {
    outline: none;
    border-color: #6247aa;
  }
`;

const CommentSubmitButton = styled.button`
  align-self: flex-end;
  padding: 10px 20px;
  background-color: #6247aa;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #533d90;
  }

  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
`;

const SimilarProductsSection = styled.div`
  margin: 40px 0;
`;

const SectionTitle = styled.h2`
  font-size: 22px;
  font-weight: 500;
  margin-bottom: 20px;
  color: #333;
`;

const SimilarProductsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 20px;
`;

const ProductCard = styled.div`
  background-color: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease, box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }
`;

const ProductImageContainer = styled.div`
  position: relative;
  height: 180px;
  overflow: hidden;
`;

const ProductInfo = styled.div`
  padding: 12px;
`;

const ProductCardTitle = styled.h3`
  font-size: 16px;
  margin: 0 0 8px 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: #333;
`;

const ProductCardPrice = styled.div`
  font-weight: 600;
  font-size: 16px;
  color: #333;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const ProductCardBadge = styled.span`
  font-size: 12px;
  background-color: #e8f4fd;
  color: #0277bd;
  padding: 2px 6px;
  border-radius: 4px;
`;

const ProductCardSpecs = styled.div`
  margin-top: 8px;
  font-size: 13px;
  color: #757575;

  & > div {
    margin-bottom: 2px;
  }
`;

interface LikeButtonProps {
  liked?: boolean;
  onClick: () => void;
  ariaLabel: string;
  loading?: boolean;
}

const ProductLikeButton: React.FC<LikeButtonProps> = ({
  liked,
  onClick,
  ariaLabel,
  loading,
}) => {
  return (
    <button
      onClick={onClick}
      aria-label={ariaLabel}
      disabled={loading}
      style={{
        background: "none",
        border: "none",
        padding: 0,
        cursor: loading ? "wait" : "pointer",
        color: liked ? "#f44336" : "#bbb",
        position: "relative",
      }}
    >
      <svg width="18" height="18" viewBox="0 0 24 24">
        <path
          fill={liked ? "#f44336" : "transparent"}
          stroke={liked ? "#f44336" : "#bbb"}
          strokeWidth="1.5"
          d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
        />
      </svg>
      {loading && (
        <span
          style={{
            position: "absolute",
            top: "-8px",
            right: "-8px",
            width: "14px",
            height: "14px",
            borderRadius: "50%",
            border: "2px solid #f3f3f3",
            borderTop: "2px solid #f44336",
            animation: "spin 1s linear infinite",
          }}
        ></span>
      )}
    </button>
  );
};

const ProductPage = () => {
  const params = useParams();
  const router = useRouter();
  const productId = params?.id as string;
  const { user } = useUser();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mainImage, setMainImage] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);
  const [isFavorite, setIsFavorite] = useState<boolean>(false);
  const [favorites, setFavorites] = useState<Product[]>([]);
  const [loadingFavorites, setLoadingFavorites] = useState(false);
  const [isPhoneVisible, setIsPhoneVisible] = useState(false);
  const [phone, setPhone] = useState<string>("Показать номер");
  const mapRef = useRef<HTMLDivElement>(null);
  const googleMapRef = useRef<google.maps.Map | null>(null);
  const markerRef = useRef<google.maps.Marker | null>(null);
  const [mapCenter, setMapCenter] = useState<{ lat: number; lng: number }>({
    lat: 41.299496,
    lng: 69.240073,
  });
  const [activeTab, setActiveTab] = useState<"description" | "fromYou">(
    "description"
  );
  const [similarProducts, setSimilarProducts] = useState<Product[]>([]);
  const [likedProducts, setLikedProducts] = useState<Record<number, boolean>>(
    {}
  );
  const [commentText, setCommentText] = useState<string>("");
  const [isSubmittingComment, setIsSubmittingComment] =
    useState<boolean>(false);

  const productFetched = useRef(false);
  const mapInitialized = useRef(false);
  const similarProductsFetched = useRef(false);

  useEffect(() => {
    const fetchFavorites = async () => {
      if (!user) {
        setFavorites([]);
        setLikedProducts({});
        return;
      }

      try {
        setLoadingFavorites(true);
        const favoritesData = await api.user.getFavorites();
        setFavorites(favoritesData);

        // Check if current product is in favorites
        if (product) {
          const isProductFavorite = favoritesData.some(
            (fav) => fav.id === product.id
          );
          setIsFavorite(isProductFavorite);
        }

        // Update likedProducts state for similar products
        if (similarProducts.length > 0) {
          const likedMap: Record<number, boolean> = {};
          similarProducts.forEach((product) => {
            likedMap[product.id] = favoritesData.some(
              (fav) => fav.id === product.id
            );
          });
          setLikedProducts(likedMap);
        }
      } catch (err) {
        console.error("Error fetching favorites:", err);
        // Don't show error toast here, just log it
      } finally {
        setLoadingFavorites(false);
      }
    };

    fetchFavorites();
  }, [user, product?.id, similarProducts]); // Add similarProducts to dependencies

  // Fetch product details - only when productId changes
  useEffect(() => {
    if (!productId || productFetched.current) return;

    const fetchProduct = async () => {
      try {
        setLoading(true);
        productFetched.current = true;

        const productData = await api.product.getById(productId);
        setProduct(productData);
        console.log("Product data:", productData);

        // Set main image
        if (productData.images && productData.images.length > 0) {
          const main = productData.images.find((img) => img.is_main);
          setMainImage(main ? main.url : productData.images[0].url);
          setCurrentImageIndex(
            main ? productData.images.findIndex((img) => img.is_main) : 0
          );
        }

        // Check if product is in favorites after product is fetched
        if (favorites.length > 0) {
          const isProductFavorite = favorites.some(
            (fav) => fav.id === productData.id
          );
          setIsFavorite(isProductFavorite);
        }

        // Set map center if location data is available
        // Check and validate coordinates
        let validLat = null;
        let validLng = null;

        // First check product.address
        if (productData.address?.lat && productData.address?.long) {
          // Try to parse as floats
          const parsedLat = parseFloat(productData.address.lat);
          const parsedLng = parseFloat(productData.address.long);

          // Validate coordinates are in valid range
          if (
            !isNaN(parsedLat) &&
            !isNaN(parsedLng) &&
            parsedLat >= -90 &&
            parsedLat <= 90 &&
            parsedLng >= -180 &&
            parsedLng <= 180 &&
            !(parsedLat === parsedLng && parsedLat === 41.11111)
          ) {
            // Detect dummy data
            validLat = parsedLat;
            validLng = parsedLng;
            console.log(
              "Using product.address coordinates:",
              validLat,
              validLng
            );
          }
        }

        // If not found, try user.addresses
        if (
          validLat === null &&
          productData.user?.addresses?.[0]?.lat &&
          productData.user?.addresses?.[0]?.long
        ) {
          const parsedLat = parseFloat(productData.user.addresses[0].lat);
          const parsedLng = parseFloat(productData.user.addresses[0].long);

          if (
            !isNaN(parsedLat) &&
            !isNaN(parsedLng) &&
            parsedLat >= -90 &&
            parsedLat <= 90 &&
            parsedLng >= -180 &&
            parsedLng <= 180 &&
            !(parsedLat === parsedLng && parsedLat === 41.11111)
          ) {
            // Detect dummy data
            validLat = parsedLat;
            validLng = parsedLng;
            console.log(
              "Using user.addresses coordinates:",
              validLat,
              validLng
            );
          }
        }

        // If still no valid coordinates, use Tashkent default
        if (validLat === null) {
          validLat = 41.299496; // Tashkent default
          validLng = 69.240073;
          console.log("Using default Tashkent coordinates");
        }

        setMapCenter({
          lat: validLat as number,
          lng: validLng as number,
        });
      } catch (err) {
        console.error("error fetching product:", err);
        setError("не удалось загрузить данные продукта");
        productFetched.current = false; // Reset flag to allow retry
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();

    // Reset flags when productId changes
    return () => {
      productFetched.current = false;
      mapInitialized.current = false;
      similarProductsFetched.current = false;
    };
  }, [productId]); // Only depend on productId

  // Update favorite status when product or favorites change
  useEffect(() => {
    if (product && favorites.length > 0) {
      const isProductFavorite = favorites.some((fav) => fav.id === product.id);
      setIsFavorite(isProductFavorite);
    }
  }, [product?.id, favorites]);

  // Fetch similar products
  useEffect(() => {
    if (!product?.id || similarProductsFetched.current) return;

    const fetchSimilarProducts = async () => {
      try {
        similarProductsFetched.current = true;
        const similar = await api.product.getSimilar(
          product.brand_id,
          product.model_id
        );
        setSimilarProducts(
          similar.filter((p: Product) => p.id !== product.id).slice(0, 8)
        );
      } catch (err) {
        console.error("Error fetching similar products:", err);
        similarProductsFetched.current = false; // Reset flag to allow retry
      }
    };

    fetchSimilarProducts();
  }, [product?.id]); // Only depend on product.id

  // Memoize the initializeMap function to prevent unnecessary recreations
  const initializeMap = useCallback(() => {
    if (!window.google?.maps || !mapRef.current || !product) {
      return;
    }

    // Check if the map container is visible
    if (!mapRef.current.offsetParent) {
      console.log("Map container not visible, skipping initialization");
      return;
    }

    console.log("Initializing map with center:", mapCenter);
    mapInitialized.current = true;

    // Force map container to be visible
    if (mapRef.current) {
      mapRef.current.style.display = "block";
    }

    // Initialize the map
    const mapInstance = new google.maps.Map(mapRef.current, {
      center: mapCenter,
      zoom: 15,
      zoomControl: true,
      scrollwheel: true,
      disableDoubleClickZoom: false,
      fullscreenControl: true,
      streetViewControl: true,
      clickableIcons: true,
      mapTypeControl: true,
    });

    // Save map instance to ref
    googleMapRef.current = mapInstance;

    // Create marker
    const markerInstance = new google.maps.Marker({
      position: mapCenter,
      map: mapInstance,
      title:
        product?.address?.address ||
        product?.user?.addresses?.[0]?.address ||
        "",
    });

    // Log marker position for debugging
    console.log("Marker position:", markerInstance.getPosition()?.toJSON());

    // Save marker instance to ref
    markerRef.current = markerInstance;

    // Trigger a resize event to ensure the map renders correctly
    setTimeout(() => {
      window.dispatchEvent(new Event("resize"));
    }, 100);
  }, [mapCenter, product]);

  // Effect to handle tab changes and map initialization
  useEffect(() => {
    // Clear map when changing tabs
    if (activeTab !== "description") {
      mapInitialized.current = false;
      if (googleMapRef.current && window.google?.maps?.event) {
        google.maps.event.clearInstanceListeners(googleMapRef.current);
      }
      if (markerRef.current) {
        if ((markerRef.current as any).map) {
          markerRef.current.setMap(null);
        }
      }
      return;
    }

    // Skip if no product or map element
    if (!product || !mapRef.current) return;

    // Reset initialization flag when switching to description tab
    if (activeTab === "description") {
      mapInitialized.current = false;

      // Add a delay to ensure the DOM is updated and API loaded
      const timer = setTimeout(() => {
        if (mapRef.current && product) {
          initializeMap();
        }
      }, 500);

      return () => {
        clearTimeout(timer);
      };
    }
  }, [activeTab, product, initializeMap]);

  // Additional effect to reinitialize map when center changes
  useEffect(() => {
    if (activeTab === "description" && mapCenter && mapRef.current) {
      // Force reinitialize map when center changes
      if (mapInitialized.current) {
        if (googleMapRef.current) {
          googleMapRef.current.setCenter(mapCenter);
          if (markerRef.current) {
            markerRef.current.setPosition(mapCenter);
          }
        }
      } else {
        // Initialize map if not already initialized
        const timer = setTimeout(() => {
          initializeMap();
        }, 500);

        return () => {
          clearTimeout(timer);
        };
      }
    }
  }, [mapCenter, activeTab, initializeMap]);

  const handlePrevImage = () => {
    if (product?.images) {
      const newIndex =
        (currentImageIndex - 1 + product.images.length) % product.images.length;
      setCurrentImageIndex(newIndex);
      setMainImage(product.images[newIndex].url);
    }
  };

  const handleNextImage = () => {
    if (product?.images) {
      const newIndex = (currentImageIndex + 1) % product.images.length;
      setCurrentImageIndex(newIndex);
      setMainImage(product.images[newIndex].url);
    }
  };

  // Toggle the favorite status of the current product
  const toggleFavorite = async () => {
    if (!user) {
      toast.error("Пожалуйста, войдите в систему, чтобы добавить в избранное");
      return;
    }

    if (!product) {
      return;
    }

    try {
      // Optimistically update the UI immediately
      setIsFavorite(!isFavorite);
      setLoadingFavorites(true);

      if (isFavorite) {
        // Remove from favorites
        await api.user.removeFavorite(product.id);
        toast.success("Удалено из избранного");

        // Update the favorites list
        setFavorites((prevFavorites) =>
          prevFavorites.filter((fav) => fav.id !== product.id)
        );
      } else {
        // Add to favorites
        await api.user.addFavorite(product.id);
        toast.success("Добавлено в избранное");

        // Update the favorites list if product is not already in it
        if (!favorites.some((fav) => fav.id === product.id)) {
          setFavorites((prevFavorites) => [...prevFavorites, product]);
        }
      }
    } catch (err: any) {
      console.error("Error toggling favorite:", err);
      toast.error(err.message || "Не удалось обновить избранное");

      // Revert the optimistic update on error
      setIsFavorite(!isFavorite);
    } finally {
      setLoadingFavorites(false);
    }
  };

  const showPhoneNumber = () => {
    // Don't show phone number if product is archived, sold, or not checked
    if (
      isPhoneVisible ||
      (product &&
        (product.is_archived || product.is_sold || !product.is_checked))
    ) {
      return;
    }

    let userPhone = "";

    if (product?.contact_phone?.phone) {
      const phone = product.contact_phone.phone;
      userPhone = `+998 ${phone.slice(0, 2)} ${phone.slice(2, 5)} ${phone.slice(
        5,
        7
      )} ${phone.slice(7, 9)}`;

      setPhone(userPhone);
      setIsPhoneVisible(true);
    } else if (product?.user?.phone) {
      const phone = product.user.phone;
      userPhone = `+998 ${phone.slice(0, 2)} ${phone.slice(2, 5)} ${phone.slice(
        5,
        7
      )} ${phone.slice(7, 9)}`;

      setPhone(userPhone);
      setIsPhoneVisible(true);
    } else {
      toast.error("Номер телефона не найден");
    }
  };

  const sendMessage = () => {
    // Add logic to initiate a conversation with the seller
    console.log("Send message to", product?.user?.id);
  };

  const toggleLikeProduct = async (itemProductId: number) => {
    if (!user) {
      toast.error("Пожалуйста, войдите в систему, чтобы добавить в избранное");
      return;
    }

    try {
      // Check if already liked
      const isLiked = likedProducts[itemProductId];

      // Optimistically update the UI immediately
      setLikedProducts((prev) => ({
        ...prev,
        [itemProductId]: !isLiked,
      }));

      if (isLiked) {
        // Remove from favorites
        await api.user.removeFavorite(itemProductId);
        toast.success("Удалено из избранного");

        // Update favorites list
        setFavorites((prevFavorites) =>
          prevFavorites.filter((fav) => fav.id !== itemProductId)
        );
      } else {
        // Add to favorites
        await api.user.addFavorite(itemProductId);
        toast.success("Добавлено в избранное");

        // Update favorites list - find the product in similarProducts
        const productToAdd = similarProducts.find(
          (p) => p.id === itemProductId
        );
        if (
          productToAdd &&
          !favorites.some((fav) => fav.id === itemProductId)
        ) {
          setFavorites((prevFavorites) => [...prevFavorites, productToAdd]);
        }
      }
    } catch (err: any) {
      console.error("Error toggling favorite:", err);
      toast.error(err.message || "Не удалось обновить избранное");

      // Revert the optimistic update on error
      setLikedProducts((prev) => ({
        ...prev,
        [itemProductId]: !prev[itemProductId],
      }));
    }
  };

  // Update likedProducts state when favorites change
  useEffect(() => {
    if (similarProducts.length > 0 && favorites.length > 0) {
      // Create a map of product IDs to their favorite status
      const favoriteMap: Record<number, boolean> = {};

      // Check each similar product to see if it's in favorites
      similarProducts.forEach((product) => {
        favoriteMap[product.id] = favorites.some(
          (fav) => fav.id === product.id
        );
      });

      // Update the likedProducts state
      setLikedProducts(favoriteMap);
    }
  }, [similarProducts, favorites]);

  // Handle comment submission
  const submitComment = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast.error("Пожалуйста, войдите в систему, чтобы оставить комментарий");
      return;
    }

    if (!commentText.trim() || commentText.trim().length < 3) {
      toast.error("Комментарий должен содержать не менее 3 символов");
      return;
    }

    try {
      setIsSubmittingComment(true);

      if (product) {
        const comment = await api.comment.addComment({
          product_id: product.id,
          text: commentText,
        });

        // Add the new comment to the product's comments array
        setProduct((prevProduct) => {
          if (!prevProduct) return prevProduct;

          const newComment = {
            ...comment,
            user: {
              id: user.id,
              name: user.name,
              surname: user.surname,
              avatar: user.avatar,
            },
          };

          return {
            ...prevProduct,
            comments: [...(prevProduct.comments || []), newComment],
          };
        });

        // Clear the comment text
        setCommentText("");
        toast.success("Комментарий добавлен");
      }
    } catch (error) {
      console.error("Error adding comment:", error);
      toast.error("Не удалось добавить комментарий");
    } finally {
      setIsSubmittingComment(false);
    }
  };

  if (loading) {
    return (
      <>
        <Header />
        <Container>
          <LoadingContainer>загрузка продукта...</LoadingContainer>
        </Container>
        <Footer />
      </>
    );
  }

  if (error) {
    return (
      <>
        <Header />
        <Container>
          <ErrorContainer>{error}</ErrorContainer>
        </Container>
        <Footer />
      </>
    );
  }

  return (
    <>
      <style jsx global>{`
        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
      `}</style>
      <Header />
      <Container>
        <Breadcrumbs>
          <a href="/">Главная</a>
          <span>→</span>
          <span>{product?.title}</span>
        </Breadcrumbs>

        {product && (
          <ProductContainer>
            <ProductContentContainer>
              <LeftColumn>
                <ImageGallery>
                  <MainImageContainer>
                    <StyledImage
                      src={mainImage || "/images/placeholder-product.jpg"}
                      alt={product.title || "Product image"}
                      fill
                      sizes="(max-width: 768px) 100vw, 800px"
                      priority
                    />
                    <NavigationButton
                      direction="prev"
                      onClick={handlePrevImage}
                    >
                      &lt;
                    </NavigationButton>
                    <NavigationButton
                      direction="next"
                      onClick={handleNextImage}
                    >
                      &gt;
                    </NavigationButton>
                  </MainImageContainer>

                  {product.images && product.images.length > 0 && (
                    <ThumbsContainer>
                      {product.images.map((image, index) => (
                        <ThumbImageContainer
                          key={image.id || index}
                          $active={currentImageIndex === index}
                          onClick={() => {
                            setMainImage(image.url);
                            setCurrentImageIndex(index);
                          }}
                        >
                          <StyledImage
                            src={image.url}
                            alt={`Product image ${index + 1}`}
                            fill
                            sizes="80px"
                          />
                        </ThumbImageContainer>
                      ))}
                    </ThumbsContainer>
                  )}
                </ImageGallery>
              </LeftColumn>

              <RightColumn>
                <TopRow>
                  <ProductTitle>
                    {product.title || "iPhone 12 Pro 64 GB"}
                    {product.is_sold && (
                      <ProductStatusLabel $status="sold">
                        Продано
                      </ProductStatusLabel>
                    )}
                    {product.is_archived && !product.is_sold && (
                      <ProductStatusLabel $status="archived">
                        В архиве
                      </ProductStatusLabel>
                    )}
                    {!product.is_checked &&
                      !product.is_archived &&
                      !product.is_sold && (
                        <ProductStatusLabel $status="waiting">
                          На проверке
                        </ProductStatusLabel>
                      )}
                  </ProductTitle>
                  <FavoriteButton
                    className={isFavorite ? "active" : ""}
                    onClick={toggleFavorite}
                    aria-label={
                      isFavorite ? "Remove from favorites" : "Add to favorites"
                    }
                    disabled={loadingFavorites || !product}
                    style={{ position: "relative" }}
                  >
                    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                        fill={isFavorite ? "#f44336" : "transparent"}
                        stroke={isFavorite ? "#f44336" : "#888"}
                      />
                    </svg>
                    {loadingFavorites && (
                      <span
                        style={{
                          position: "absolute",
                          top: "-10px",
                          right: "-10px",
                          width: "18px",
                          height: "18px",
                          borderRadius: "50%",
                          border: "2px solid #f3f3f3",
                          borderTop: "2px solid #f44336",
                          animation: "spin 1s linear infinite",
                        }}
                      ></span>
                    )}
                  </FavoriteButton>
                </TopRow>

                <Price>
                  {product.price?.toLocaleString() || "9 000 000"}{" "}
                  {product.currency?.symbol || "UZS"}
                  <PriceTag>Торг есть</PriceTag>
                </Price>

                <LocationInfo>
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M8 8.5C8.82843 8.5 9.5 7.82843 9.5 7C9.5 6.17157 8.82843 5.5 8 5.5C7.17157 5.5 6.5 6.17157 6.5 7C6.5 7.82843 7.17157 8.5 8 8.5Z"
                      fill="#666"
                    />
                    <path
                      d="M8 1.5C11.0376 1.5 13.5 3.96243 13.5 7C13.5 11.5 8 14.5 8 14.5C8 14.5 2.5 11.5 2.5 7C2.5 3.96243 4.96243 1.5 8 1.5ZM8 3.5C6.067 3.5 4.5 5.067 4.5 7C4.5 7.544 4.622 8.087 4.887 8.781C5.152 9.475 5.519 10.197 5.962 10.881C6.675 11.992 7.506 12.952 8 13.431C8.494 12.952 9.325 11.992 10.038 10.881C10.481 10.197 10.848 9.475 11.113 8.781C11.378 8.087 11.5 7.544 11.5 7C11.5 5.067 9.933 3.5 8 3.5Z"
                      fill="#666"
                    />
                  </svg>
                  {product.address?.address ||
                    product.user?.addresses?.[0]?.address ||
                    "Адрес не указан"}
                </LocationInfo>

                <ActionsContainer>
                  <ActionButton onClick={sendMessage}>
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 18 18"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M6 8H6.01M9 8H9.01M12 8H12.01M3 12.2L3 5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H13C13.5304 3 14.0391 3.21071 14.4142 3.58579C14.7893 3.96086 15 4.46957 15 5V11C15 11.5304 14.7893 12.0391 14.4142 12.4142C14.0391 12.7893 13.5304 13 13 13H7L3 17V12.2Z"
                        stroke="#6247AA"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    Написать
                  </ActionButton>
                  <ActionButton
                    onClick={showPhoneNumber}
                    disabled={
                      isPhoneVisible ||
                      product.is_archived ||
                      product.is_sold ||
                      !product.is_checked
                    }
                    style={isPhoneVisible ? { fontSize: "16px" } : {}}
                  >
                    {isPhoneVisible ? (
                      phone
                    ) : (
                      <>
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 16 16"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M15.5438 11.5894L12.1281 10.0206C11.9156 9.92938 11.6756 9.91313 11.4519 9.97501C11.2281 10.0369 11.0344 10.1731 10.9031 10.3594L9.45625 12.3737C7.25312 11.2181 5.44062 9.40563 4.285 7.20251L6.29937 5.755C6.48625 5.62375 6.62187 5.42938 6.68312 5.20501C6.74437 4.98125 6.72875 4.74126 6.6375 4.52938L5.06875 1.11376C4.96875 0.882508 4.79625 0.691258 4.57875 0.571883C4.36125 0.452508 4.11125 0.412508 3.87187 0.458133L1.12187 1.01001C0.89125 1.05438 0.683125 1.18063 0.535625 1.36626C0.388125 1.55188 0.31 1.78376 0.3125 2.02188C0.39375 5.85626 2.04375 9.48126 4.85625 12.2906C7.66875 15.1 11.2937 16.7469 15.1281 16.825C15.3656 16.8275 15.5969 16.7494 15.7819 16.6019C15.9669 16.4544 16.0931 16.2469 16.1375 16.0163L16.6894 13.2663C16.7356 13.0281 16.6962 12.7788 16.5775 12.5619C16.4587 12.345 16.2681 12.1731 16.0375 12.0737L15.5438 11.5894Z"
                            fill="currentColor"
                          />
                        </svg>
                        {product.is_archived ||
                        product.is_sold ||
                        !product.is_checked
                          ? "Недоступно"
                          : "Показать номер"}
                      </>
                    )}
                  </ActionButton>
                </ActionsContainer>

                <SpecsContainer>
                  <SpecRow>
                    <SpecLabel>Состояние</SpecLabel>
                    <SpecValue>{product.is_new ? "Новый" : "Б/у"}</SpecValue>
                  </SpecRow>
                  <SpecRow>
                    <SpecLabel>Память</SpecLabel>
                    <SpecValue>{product.storage || "64"} GB</SpecValue>
                  </SpecRow>
                  <SpecRow>
                    <SpecLabel>Год выпуска</SpecLabel>
                    <SpecValue>{product.year || "2021"}</SpecValue>
                  </SpecRow>
                  <SpecRow>
                    <SpecLabel>Цвет</SpecLabel>
                    <SpecValue
                      style={
                        {
                          "--dot-color": product.color?.hex,
                        } as React.CSSProperties
                      }
                      className="blue-dot"
                    >
                      {product.color?.name || "Синий"}
                    </SpecValue>
                  </SpecRow>
                  <SpecRow>
                    <SpecLabel>Коробка с документами</SpecLabel>
                    <SpecValue>
                      {product.has_document ? "Есть" : "Нет"}
                    </SpecValue>
                  </SpecRow>
                </SpecsContainer>

                <PostedInfo>
                  <div>
                    Размещено:{" "}
                    {new Date(product.top_expire_date).toLocaleDateString(
                      "ru-RU"
                    ) || "17 мая 2022"}
                  </div>
                  <ViewsCount>
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M8 3.5C3 3.5 1 8 1 8C1 8 3 12.5 8 12.5C13 12.5 15 8 15 8C15 8 13 3.5 8 3.5Z"
                        stroke="#757575"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M8 10.5C9.38071 10.5 10.5 9.38071 10.5 8C10.5 6.61929 9.38071 5.5 8 5.5C6.61929 5.5 5.5 6.61929 5.5 8C5.5 9.38071 6.61929 10.5 8 10.5Z"
                        stroke="#757575"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    {product.views}
                  </ViewsCount>
                </PostedInfo>
              </RightColumn>
            </ProductContentContainer>

            {/* Description and Comments Tabs */}
            <TabsContainer>
              <Tab
                $isActive={activeTab === "description"}
                onClick={() => setActiveTab("description")}
              >
                Описание
              </Tab>
              <Tab
                $isActive={activeTab === "fromYou"}
                onClick={() => setActiveTab("fromYou")}
              >
                Комментарии ({product.comments?.length || 0})
              </Tab>
            </TabsContainer>

            <TabContent $isVisible={activeTab === "description"}>
              <DescriptionText>
                {product.description || "Описание отсутствует"}
              </DescriptionText>

              {/* Map section - inside description tab content */}
              {(product.address?.lat || product.user?.addresses?.[0]?.lat) && (
                <MapContainer ref={mapRef} />
              )}
            </TabContent>

            <TabContent $isVisible={activeTab === "fromYou"}>
              {/* Comment form */}
              <CommentForm onSubmit={submitComment}>
                <CommentTextArea
                  placeholder="Написать комментарий..."
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  disabled={isSubmittingComment || !user}
                />
                <CommentSubmitButton
                  type="submit"
                  disabled={
                    isSubmittingComment ||
                    !commentText.trim() ||
                    commentText.trim().length < 3 ||
                    !user
                  }
                >
                  {isSubmittingComment ? "Отправка..." : "Отправить"}
                </CommentSubmitButton>
              </CommentForm>

              {/* Comments list */}
              {product.comments && product.comments.length > 0 ? (
                product.comments.map((comment) => (
                  <CommentContainer key={comment.id}>
                    <CommentHeader>
                      <CommentAvatar>
                        {comment.user?.avatar ? (
                          <Image
                            src={comment.user.avatar}
                            alt={`${comment.user.name} ${comment.user.surname}`}
                            width={36}
                            height={36}
                          />
                        ) : (
                          comment.user?.name.charAt(0).toUpperCase()
                        )}
                      </CommentAvatar>
                      <CommentAuthor>
                        {comment.user?.name} {comment.user?.surname}
                      </CommentAuthor>
                    </CommentHeader>
                    <CommentText>{comment.text}</CommentText>
                  </CommentContainer>
                ))
              ) : (
                <p>Пока нет комментариев</p>
              )}
            </TabContent>
          </ProductContainer>
        )}

        {/* Similar Products Section */}
        {similarProducts.length > 0 && (
          <SimilarProductsSection>
            <SectionTitle>Вам может понравиться</SectionTitle>
            <SimilarProductsGrid>
              {similarProducts.map((similarProduct) => (
                <ProductCard key={similarProduct.id}>
                  <ProductImageContainer>
                    <StyledImage
                      src={
                        similarProduct.images?.[0]?.url ||
                        "/images/placeholder-product.jpg"
                      }
                      alt={similarProduct.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 220px"
                    />
                  </ProductImageContainer>
                  <ProductInfo>
                    <ProductCardTitle>{similarProduct.title}</ProductCardTitle>
                    <ProductCardPrice>
                      {similarProduct.price?.toLocaleString()}{" "}
                      {similarProduct.currency?.symbol || "UZS"}
                      <ProductLikeButton
                        liked={likedProducts[similarProduct.id]}
                        onClick={() => toggleLikeProduct(similarProduct.id)}
                        ariaLabel={
                          likedProducts[similarProduct.id]
                            ? "Remove from favorites"
                            : "Add to favorites"
                        }
                        loading={loadingFavorites}
                      />
                    </ProductCardPrice>
                    <ProductCardSpecs>
                      <div>
                        Состояние: {similarProduct.is_new ? "Новый" : "Б/у"}
                      </div>
                      <div>Память: {similarProduct.storage} GB</div>
                    </ProductCardSpecs>
                  </ProductInfo>
                </ProductCard>
              ))}
            </SimilarProductsGrid>
          </SimilarProductsSection>
        )}
      </Container>
      <Footer />
    </>
  );
};

export default ProductPage;
