import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/Card';
import { Button } from './ui/Button';
import { BookOpen, User, Clock } from 'lucide-react';

const CourseCard = ({ course, onEnroll, isEnrolled }) => {
  return (
    <Card className="hover:shadow-lg transition-shadow duration-300">
      <CardHeader>
        {course.thumbnail && (
          <img
            src={course.thumbnail}
            alt={course.title}
            className="w-full h-48 object-cover rounded-t-lg"
          />
        )}
        <CardTitle className="text-xl">{course.title}</CardTitle>
        <CardDescription className="flex items-center space-x-2">
          <User size={16} />
          <span>{course.teacher?.name || 'Unknown Teacher'}</span>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-gray-600 mb-4 line-clamp-3">{course.description}</p>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4 text-sm text-gray-500">
            <div className="flex items-center space-x-1">
              <Clock size={14} />
              <span>{course.duration || '2h'}</span>
            </div>
            <div className="flex items-center space-x-1">
              <BookOpen size={14} />
              <span>{course.level || 'Beginner'}</span>
            </div>
          </div>
          <div className="flex space-x-2">
            <Button asChild variant="outline" size="sm">
              <Link to={`/courses/${course._id}`}>View Details</Link>
            </Button>
            {!isEnrolled && (
              <Button onClick={() => onEnroll(course._id)} size="sm">
                Enroll
              </Button>
            )}
            {isEnrolled && (
              <Button variant="secondary" size="sm" disabled>
                Enrolled
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CourseCard;