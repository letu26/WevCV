import * as Select from "@radix-ui/react-select";
import { Check, ChevronDown } from "lucide-react";

type Props = {
  placeholder: string;
  options: string[];
};

const FilterSelect: React.FC<Props> = ({ placeholder, options }) => {
  return (
    <Select.Root>
      <Select.Trigger
        className="
          inline-flex items-center justify-between gap-2
          min-w-40
          rounded-lg bg-white px-4 py-2 text-sm
          text-gray-700
          shadow-sm border border-white/30
          hover:bg-indigo-50
          focus:outline-none
        "
      >
        <Select.Value placeholder={placeholder} />
        <Select.Icon>
          <ChevronDown className="h-4 w-4 text-gray-500" />
        </Select.Icon>
      </Select.Trigger>

      <Select.Portal>
        <Select.Content
          className="
            z-50 overflow-hidden rounded-lg
            bg-white shadow-xl border
          "
        >
          <Select.Viewport className="p-1">
            {options.map((item) => (
              <Select.Item
                key={item}
                value={item}
                className="
                  relative flex items-center px-3 py-2
                  text-sm rounded-md cursor-pointer
                  text-gray-700
                  hover:bg-indigo-50
                  focus:bg-indigo-50
                  outline-none
                "
              >
                <Select.ItemText>{item}</Select.ItemText>
                <Select.ItemIndicator className="absolute right-2">
                  <Check className="h-4 w-4 text-indigo-600" />
                </Select.ItemIndicator>
              </Select.Item>
            ))}
          </Select.Viewport>
        </Select.Content>
      </Select.Portal>
    </Select.Root>
  );
};

export default FilterSelect;
