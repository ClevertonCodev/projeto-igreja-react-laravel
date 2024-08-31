import getToken from "./GetToken";
import decodeToken from "./DecodeToken";

export const authGuard = async () => {
    try {
        const token = await getToken();

        if (!token) {
            return false;
        }

        const decoded = decodeToken(token);

        if (!decoded) {
            return false;
        }

        const currentTime = Date.now() / 1000;
        if (decoded.exp < currentTime) {
            return false;
        }

        return true;
    } catch (error) {
        return false;
    }
};

