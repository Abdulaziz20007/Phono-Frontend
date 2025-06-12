import { useState, useCallback, useEffect } from "react";
import {
  UserProfile,
  UserAdditionalPhone,
  UserRegisteredEmail,
  UserAddress,
  Ad,
  ActiveProfileTab,
} from "../types";
import { api } from "../../../api/api";
import { Product, UserProfile as ApiUserProfile } from "../../../api/types";
import { useRouter } from "next/navigation";

// Helper function to convert Product to Ad
const convertProductToAd = (
  product: Product,
  isFavorite: boolean = false
): Ad => {
  let imageUrl = "/images/placeholder-phone1.jpg";
  if (product.images && product.images.length > 0) {
    const mainImage = product.images.find((img) => img.is_main);
    imageUrl = mainImage ? mainImage.url : product.images[0].url;
  }

  // Determine product status
  let status: "active" | "waiting" | "deactive" = "active";

  if (product.is_archived || product.is_sold) {
    status = "deactive";
  } else if (!product.is_checked) {
    status = "waiting";
  }

  return {
    id: product.id.toString(),
    title: product.title,
    imageUrl,
    condition: product.is_new ? "Новый" : "Б/У",
    memory: `${product.storage} GB`,
    price: product.price,
    currency: product.currency_id === 1 ? "UZS" : "USD",
    isFavorite,
    tags: product.floor_price ? ["Торг есть"] : [],
    status,
    is_archived: product.is_archived,
    is_checked: product.is_checked,
    is_sold: product.is_sold,
  };
};

// Helper function to map API UserProfile to our local UserProfile type
const mapApiProfileToLocalProfile = (
  apiProfile: ApiUserProfile
): UserProfile => {
  return {
    id: apiProfile.id,
    name: apiProfile.name,
    surname: apiProfile.surname,
    phone: apiProfile.phone,
    avatar: apiProfile.avatar || "/images/placeholder-avatar.jpg",
    balance: apiProfile.balance,
    currency_id: apiProfile.currency_id,
    is_active: apiProfile.is_active,
    usernameForDisplay: `${apiProfile.name} ${apiProfile.surname}`,
    dob: apiProfile.dob || null,
    appLanguage: "ru",
    emails: Array.isArray(apiProfile.emails) ? apiProfile.emails : [],
    additional_phones: Array.isArray(apiProfile.additional_phones)
      ? apiProfile.additional_phones
      : [],
    addresses: Array.isArray(apiProfile.addresses) ? apiProfile.addresses : [],
  };
};

export const useProfileData = () => {
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [ads, setAds] = useState<Ad[]>([]);
  const [favoriteAds, setFavoriteAds] = useState<Ad[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<ActiveProfileTab>("ads");

  // Check if user is authenticated
  const checkAuthentication = useCallback(() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        router.push("/auth");
        return false;
      }
      return true;
    }
    return false;
  }, [router]);

  // Fetch user profile data (and set ads/favorites from it)
  const fetchUserProfile = useCallback(async () => {
    try {
      if (!checkAuthentication()) return;
      setIsLoading(true);
      const profileData = await api.user.getProfile();
      setUser(mapApiProfileToLocalProfile(profileData));

      // Map user's own products to ads
      const userAds = Array.isArray(profileData.products)
        ? profileData.products
        : [];
      const formattedAds = userAds.map((product: Product) =>
        convertProductToAd(product, false)
      );
      setAds(formattedAds);

      // Get the favorite product IDs from the user's favorite_items
      const favoriteProductIds = Array.isArray(profileData.favourite_items)
        ? profileData.favourite_items.map((fav: any) => fav.product_id)
        : [];

      if (favoriteProductIds.length > 0) {
        try {
          // Fetch detailed product information for each favorited product
          const favoriteProducts: Product[] = [];

          // Since there's no endpoint to fetch multiple products at once,
          // we'll fetch them one by one
          for (const productId of favoriteProductIds) {
            try {
              const product = await api.product.getById(productId);
              favoriteProducts.push(product);
            } catch (err) {
              console.error(
                `Error fetching favorite product ${productId}:`,
                err
              );
              // Continue with other products even if one fails
            }
          }

          // Convert fetched products to Ad format with isFavorite=true
          const formattedFavoriteAds = favoriteProducts.map((product) =>
            convertProductToAd(product, true)
          );
          setFavoriteAds(formattedFavoriteAds);
        } catch (err) {
          console.error("Error fetching favorite products:", err);
        }
      }
    } catch (err) {
      console.error("Error fetching user profile:", err);
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch profile";
      setError(errorMessage);
      if (
        errorMessage.includes("401") ||
        errorMessage.includes("unauthorized")
      ) {
        if (typeof window !== "undefined") {
          localStorage.removeItem("accessToken");
          router.push("/auth");
        }
      }
    } finally {
      setIsLoading(false);
    }
  }, [checkAuthentication, router]);

  // Remove fetchUserAds, and update refreshAds to just call fetchUserProfile
  const refreshAds = useCallback(() => {
    fetchUserProfile();
  }, [fetchUserProfile]);

  // Load data on component mount
  useEffect(() => {
    const loadData = async () => {
      if (checkAuthentication()) {
        await fetchUserProfile();
      }
    };
    loadData();
  }, [fetchUserProfile, checkAuthentication]);

  // Update user profile
  const updateUserProfileInfo = useCallback(
    async (
      data: Partial<
        Pick<
          UserProfile,
          "name" | "surname" | "currency_id" | "is_active" | "avatar"
        >
      >
    ) => {
      try {
        setIsLoading(true);
        if (!user) throw new Error("User not loaded");
        const updatedProfile = await api.user.updateProfile(user.id, data);
        setUser((prevUser) => {
          if (!prevUser) return null;
          return {
            ...prevUser,
            ...mapApiProfileToLocalProfile(updatedProfile),
          };
        });
      } catch (err) {
        console.error("Error updating user profile:", err);
        setError(
          err instanceof Error ? err.message : "Failed to update profile"
        );
      } finally {
        setIsLoading(false);
      }
    },
    [user]
  );

  // Toggle favorite status for an ad
  const toggleFavoriteAd = useCallback(
    async (adId: string) => {
      try {
        await api.user.toggleFavorite(parseInt(adId));

        // Update local state to reflect the change
        setAds((prevAds) =>
          prevAds.map((ad) =>
            ad.id === adId ? { ...ad, isFavorite: !ad.isFavorite } : ad
          )
        );

        // Also update favoriteAds state
        const adToToggle = [...ads, ...favoriteAds].find(
          (ad) => ad.id === adId
        );

        if (adToToggle) {
          if (adToToggle.isFavorite) {
            // Remove from favorites if it was favorited
            setFavoriteAds((prevFavorites) =>
              prevFavorites.filter((fav) => fav.id !== adId)
            );
          } else {
            // Add to favorites if it wasn't favorited
            setFavoriteAds((prevFavorites) => [
              ...prevFavorites,
              { ...adToToggle, isFavorite: true },
            ]);
          }
        }

        // Refresh profile to ensure data is up to date
        fetchUserProfile();
      } catch (err) {
        console.error("Error toggling favorite:", err);
        setError(
          err instanceof Error ? err.message : "Failed to toggle favorite"
        );
      }
    },
    [ads, favoriteAds, fetchUserProfile]
  );

  // Add phone number
  const addPhoneNumber = useCallback(async (phone: string) => {
    try {
      const newPhone = await api.user.addPhoneNumber(phone);

      setUser((prevUser) => {
        if (!prevUser) return null;
        return {
          ...prevUser,
          additional_phones: [...prevUser.additional_phones, newPhone],
        };
      });
    } catch (err) {
      console.error("Error adding phone number:", err);
      setError(
        err instanceof Error ? err.message : "Failed to add phone number"
      );
    }
  }, []);

  // Delete phone number
  const deletePhoneNumber = useCallback(async (phoneId: number) => {
    try {
      await api.user.deletePhoneNumber(phoneId);

      setUser((prevUser) => {
        if (!prevUser) return null;
        return {
          ...prevUser,
          additional_phones: prevUser.additional_phones.filter(
            (p) => p.id !== phoneId
          ),
        };
      });
    } catch (err) {
      console.error("Error deleting phone number:", err);
      setError(
        err instanceof Error ? err.message : "Failed to delete phone number"
      );
    }
  }, []);

  // Add email
  const addEmail = useCallback(async (email: string) => {
    try {
      const newEmail = await api.user.addEmail(email);

      setUser((prevUser) => {
        if (!prevUser) return null;
        return {
          ...prevUser,
          emails: [
            ...prevUser.emails,
            {
              id: newEmail.user_id,
              user_id: newEmail.user_id,
              email: newEmail.email,
              is_active: newEmail.is_active,
            },
          ],
        };
      });
    } catch (err) {
      console.error("error adding email:", err);
      setError(err instanceof Error ? err.message : "failed to add email");
    }
  }, []);

  // Delete email
  const deleteEmail = useCallback(async (emailId: number) => {
    try {
      await api.user.deleteEmail(emailId);

      setUser((prevUser) => {
        if (!prevUser) return null;
        return {
          ...prevUser,
          emails: prevUser.emails.filter((e) => e.id !== emailId),
        };
      });
    } catch (err) {
      console.error("Error deleting email:", err);
      setError(err instanceof Error ? err.message : "Failed to delete email");
    }
  }, []);

  // Edit email
  const editEmail = useCallback(async (emailId: number, newEmail: string) => {
    try {
      const updatedEmail = await api.user.editEmail(emailId, newEmail);

      setUser((prevUser) => {
        if (!prevUser) return null;
        return {
          ...prevUser,
          emails: prevUser.emails.map((e) =>
            e.id === emailId ? updatedEmail : e
          ),
        };
      });
    } catch (err) {
      console.error("Error editing email:", err);
      setError(err instanceof Error ? err.message : "Failed to edit email");
    }
  }, []);

  // Add address
  const addAddress = useCallback(
    async (addressData: Omit<UserAddress, "id" | "user_id">) => {
      try {
        // Convert null to undefined for lat and long to match the API type
        const apiAddressData = {
          name: addressData.name,
          address: addressData.address,
          lat: addressData.lat || "0", // provide default value if missing
          long: addressData.long || "0", // provide default value if missing
          region_id: addressData.region_id, // pass region_id
        };

        const newAddress = await api.user.addAddress(apiAddressData);

        // Ensure the new address conforms to UserAddress type
        const typedNewAddress: UserAddress = {
          id: newAddress.id,
          name: newAddress.name,
          address: newAddress.address,
          lat: newAddress.lat || "0", // ensure non-null string
          long: newAddress.long || "0", // ensure non-null string
          user_id: newAddress.user_id,
          region_id: newAddress.region_id, // assign region_id
        };

        setUser((prevUser) => {
          if (!prevUser) return null;
          return {
            ...prevUser,
            addresses: [...prevUser.addresses, typedNewAddress],
          };
        });
      } catch (err) {
        console.error("Error adding address:", err);
        setError(err instanceof Error ? err.message : "Failed to add address");
      }
    },
    []
  );

  // Delete address
  const deleteAddress = useCallback(async (addressId: number) => {
    try {
      await api.user.deleteAddress(addressId);

      setUser((prevUser) => {
        if (!prevUser) return null;
        return {
          ...prevUser,
          addresses: prevUser.addresses.filter((a) => a.id !== addressId),
        };
      });
    } catch (err) {
      console.error("Error deleting address:", err);
      setError(err instanceof Error ? err.message : "Failed to delete address");
    }
  }, []);

  // Change language
  const changeLanguage = useCallback(async (lang: "ru" | "en" | "uz") => {
    try {
      await api.user.changeLanguage(lang);

      setUser((prevUser) => {
        if (!prevUser) return null;
        return {
          ...prevUser,
          appLanguage: lang,
        };
      });
    } catch (err) {
      console.error("Error changing language:", err);
      setError(
        err instanceof Error ? err.message : "Failed to change language"
      );
    }
  }, []);

  // Logout user
  const logoutUser = useCallback(async () => {
    try {
      await api.auth.logout();
      // Clear local storage and redirect to login page
      if (typeof window !== "undefined") {
        localStorage.removeItem("accessToken");
        window.location.href = "/auth";
      }
    } catch (err) {
      console.error("Error logging out:", err);
      setError(err instanceof Error ? err.message : "Failed to logout");
    }
  }, []);

  return {
    user,
    ads,
    favoriteAds,
    isLoading,
    error,
    activeTab,
    setActiveTab,
    updateUserProfileInfo,
    toggleFavoriteAd,
    addPhoneNumber,
    deletePhoneNumber,
    addEmail,
    deleteEmail,
    editEmail,
    addAddress,
    deleteAddress,
    changeLanguage,
    logoutUser,
    refreshProfile: fetchUserProfile,
    refreshAds,
  };
};
