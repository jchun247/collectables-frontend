import PropTypes from 'prop-types';
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const FeatureCard = ({ icon, title, description }) => (
    <Card className="border-2 h-full">
        <CardHeader>
            <div className="mb-4">{icon}</div>
            <CardTitle>{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
        </CardHeader>
    </Card>
);

FeatureCard.propTypes = {
    icon: PropTypes.node.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
};

export default FeatureCard;
