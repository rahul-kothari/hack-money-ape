import { Text } from '@chakra-ui/layout';

interface DetailItemProps {
    name: string | React.ReactElement,
    value: string | React.ReactElement,
}

export const DetailItem: React.FC<DetailItemProps> = (props) => {
    const {name, value} = props;

    return <div className="flex flex-row justify-between gap-4">
        <Text>{name}</Text>
        <Text>{value}</Text>
    </div>
}