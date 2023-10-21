import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";

const Rating = ({ value, text }) => {
  return (
    <div className="rating mb-2">
      <span>
        {value >= 1 ? (
          <FaStar></FaStar>
        ) : value >= 0.5 ? (
          <FaStarHalfAlt></FaStarHalfAlt>
        ) : (
          <FaRegStar></FaRegStar>
        )}
      </span>
      <span>
        {value >= 2 ? (
          <FaStar></FaStar>
        ) : value >= 1.5 ? (
          <FaStarHalfAlt></FaStarHalfAlt>
        ) : (
          <FaRegStar></FaRegStar>
        )}
      </span>
      <span>
        {value >= 3 ? (
          <FaStar></FaStar>
        ) : value >= 2.5 ? (
          <FaStarHalfAlt></FaStarHalfAlt>
        ) : (
          <FaRegStar></FaRegStar>
        )}
      </span>
      <span>
        {value >= 4 ? (
          <FaStar></FaStar>
        ) : value >= 3.5 ? (
          <FaStarHalfAlt></FaStarHalfAlt>
        ) : (
          <FaRegStar></FaRegStar>
        )}
      </span>
      <span>
        {value >= 5 ? (
          <FaStar></FaStar>
        ) : value >= 4.5 ? (
          <FaStarHalfAlt></FaStarHalfAlt>
        ) : (
          <FaRegStar></FaRegStar>
        )}
      </span>
      <span>{text && text}</span>
    </div>
  );
};

export default Rating;
