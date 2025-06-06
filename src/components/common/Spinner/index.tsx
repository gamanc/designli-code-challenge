import { ProgressCircle, type ConditionalValue } from "@chakra-ui/react";

interface Props {
  size: ConditionalValue<"sm" | "md" | "lg" | "xl" | "xs" | undefined>;
}

const Spinner = ({ size }: Props) => {
  return (
    <ProgressCircle.Root size={size} value={30}>
      <ProgressCircle.Circle>
        <ProgressCircle.Track />
        <ProgressCircle.Range strokeLinecap="round" />
      </ProgressCircle.Circle>
    </ProgressCircle.Root>
  );
};

export default Spinner;
