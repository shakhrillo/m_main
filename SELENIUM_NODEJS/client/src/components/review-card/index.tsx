import { useState } from 'react';
import StarRating from '../star-rating';

interface Review {
  user: {
    name: string;
    info: string[];
  };
  rating: string;
  date: string;
  review: string;
  response: string;
}

const UserHeader = ({ user }: { user: Review['user'] }) => (
  <div className="single-review__wrapper__body__item__header">
    <span className="single-review__wrapper__body__item__header__icon">
      <i className="bi bi-person"></i>
    </span>
    <div className="single-review__wrapper__body__item__header__user">
      <a
        className="single-review__wrapper__body__item__header__user__name"
        target="_blank"
        rel="noreferrer"
      >
        {user.name || 'Anonymous'}
      </a>
      <span className="single-review__wrapper__body__item__header__user__reviews">
        {user.info.length ? user.info[0] : ''}
      </span>
    </div>
  </div>
);

const RatingInfo = ({ rating, date }: { rating: string; date: string }) => (
  <div className="single-review__wrapper__body__item__rating">
    <StarRating
      rating={(
        rating.match(/(\d+)/)?.[0] ? parseInt(rating.match(/(\d+)/)?.[0] ?? '0', 10) : 0
      ).toString()}
    />
    {" | "}
    <span>
      Created at: <b>{date}</b>
    </span>
  </div>
);

const ToggleContent = ({ label, content }: { label: string; content: string }) => {
  const [isVisible, setIsVisible] = useState(false);
  
  return (
    <div className="single-review__wrapper__body__item__content">
      <div className="single-review__wrapper__body__item__content__header">
        {label}
        <button
          onClick={() => setIsVisible(prev => !prev)}
          className="btn single-review__wrapper__body__item__content__header__toggle geo-btn-transparent geo-btn-outline"
        >
          <i className={`bi bi-chevron-${isVisible ? 'up' : 'down'}`}></i>
        </button>
      </div>
      {isVisible && (
        <span className="single-review__wrapper__body__item__content__body">
          {content || `No ${label.toLowerCase()}`}
        </span>
      )}
    </div>
  );
};

export const ReviewCard = ({ review }: { review: Review }) => (
  <div className="single-review__wrapper__body">
    <div className="single-review__wrapper__body__item">
      <UserHeader user={review.user} />
      <RatingInfo rating={review.rating || ''} date={review.date} />
      <ToggleContent label="Review" content={review.review} />
      <ToggleContent label="Reply" content={review.response} />
    </div>
  </div>
);
