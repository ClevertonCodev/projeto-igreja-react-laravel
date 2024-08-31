import jwt_decode from 'jwt-decode';

const decodeToken = (token) => {
   try {
      return jwt_decode(token);
   } catch (error) {
      return null;
   }
};

export default decodeToken;

