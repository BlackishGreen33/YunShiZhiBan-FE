'use client';

import { File, Menu } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/common/components/ui/button';
import { Checkbox } from '@/common/components/ui/checkbox';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/common/components/ui/form';
import { Input } from '@/common/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/common/components/ui/select';
import { CheckedState } from '@radix-ui/react-checkbox';
import axios from 'axios';
import { ChangeEvent, useEffect, useState } from 'react';

const formSchema = z.object({
  source_image: z.string().optional(),
  driven_audio: z.string().optional(),
  enhancer: z.string().optional(),
  preprocess: z.string().optional(),
  ref_eyeblink: z.string().optional(),
  ref_pose: z.string().optional(),
  still: z.boolean().optional(),
});

const PlaygroundInput: React.FC = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    defaultValues: {
      source_image: '',
      driven_audio: '',
      enhancer: 'gfpgan',
      preprocess: 'full',
      ref_eyeblink: '',
      ref_pose: '',
      still: true,
    },
  });

  const [formData, setFormData] = useState(new FormData());
  useEffect(() => {
    // 在组件加载时创建并设置初始值
    const initialFormData = createInitialFormData();
    setFormData(initialFormData);
  }, []);

  // 创建初始的 FormData 对象
  const createInitialFormData = () => {
    const initialFormData = new FormData();
    initialFormData.append('enhancer', 'gfpgan');
    initialFormData.append('preprocess', 'full');
    initialFormData.append('still', 'true');
    return initialFormData;
  };

  function onSubmit() {
    console.log(formData.values());
    axios
      .post('/api/inference', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      .then((response) => {
        console.log(response.data);
      })
      .catch((error) => {
        console.error(
          'There has been a problem with your axios operation:',
          error
        );
      });
  }

  // 处理文件上传
  const handleFileUpload = (
    event: ChangeEvent<HTMLInputElement>,
    fieldName: string
  ) => {
    const file = event.target?.files?.[0];
    if (file) {
      setFormData((prev) => {
        if (prev.has(fieldName)) {
          prev.set(fieldName, file);
        } else {
          prev.append(fieldName, file);
        }
        return prev;
      });
    }
  };

  // 处理
  const handleSelect = (event: string, fieldName: string) => {
    setFormData((prev) => {
      if (prev.has(fieldName)) {
        prev.set(fieldName, event);
      } else {
        prev.append(fieldName, event);
      }
      return prev;
    });
  };
  const handleCheck = (event: CheckedState, fieldName: string) => {
    setFormData((prev) => {
      if (prev.has(fieldName)) {
        prev.set(fieldName, event.toString());
      } else {
        prev.append(fieldName, event.toString());
      }
      return prev;
    });
  };

  return (
    <Form {...form}>
      <form className="space-y-8">
        <FormField
          control={form.control}
          name="source_image"
          render={() => (
            <FormItem>
              <FormLabel>
                <div className="flex">
                  <File size={16} className="mr-1.5" />
                  source_image
                  <span style={{ color: 'hsl(10, 71.5%, 50%)' }}>*</span>
                  <span
                    className="ml-1.5"
                    style={{ color: 'hsl(0, 0%, 52.3%)' }}
                  >
                    file
                  </span>
                </div>
              </FormLabel>
              <FormControl>
                <Input
                  type="file"
                  id="source_image"
                  onChange={(event) => handleFileUpload(event, 'source_image')}
                />
              </FormControl>
              <FormDescription>
                Upload the source image, it can be video.mp4 or picture.png
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="driven_audio"
          render={() => (
            <FormItem>
              <FormLabel>
                <div className="flex">
                  <File size={16} className="mr-1.5" />
                  driven_audio
                  <span style={{ color: 'hsl(10, 71.5%, 50%)' }}>*</span>
                  <span
                    className="ml-1.5"
                    style={{ color: 'hsl(0, 0%, 52.3%)' }}
                  >
                    file
                  </span>
                </div>
              </FormLabel>
              <FormControl>
                <Input
                  type="file"
                  id="driven_audio"
                  onChange={(event) => handleFileUpload(event, 'driven_audio')}
                />
              </FormControl>
              <FormDescription>
                Upload the driven audio, accepts .wav and .mp4 file
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="enhancer"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                <div className="flex">
                  <Menu size={16} className="mr-1.5" />
                  enhancer
                  <span
                    className="ml-1.5"
                    style={{ color: 'hsl(0, 0%, 52.3%)' }}
                  >
                    string
                  </span>
                </div>
              </FormLabel>
              <FormControl>
                <Select
                  onValueChange={(event) => handleSelect(event, 'enhancer')}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a verified email to display" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="gfpgan">gfpgan</SelectItem>
                    <SelectItem value="RestoreFormer">RestoreFormer</SelectItem>
                    <SelectItem value="None">None</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormDescription>Choose a face enhancer</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="preprocess"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                <div className="flex">
                  <Menu size={16} className="mr-1.5" />
                  preprocess
                  <span
                    className="ml-1.5"
                    style={{ color: 'hsl(0, 0%, 52.3%)' }}
                  >
                    string
                  </span>
                </div>
              </FormLabel>
              <FormControl>
                <Select
                  onValueChange={(event) => handleSelect(event, 'preprocess')}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a verified email to display" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="full">full</SelectItem>
                    <SelectItem value="crop">crop</SelectItem>
                    <SelectItem value="resize">resize</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormDescription>how to preprocess the images</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="ref_eyeblink"
          render={() => (
            <FormItem>
              <FormLabel>
                <div className="flex">
                  <File size={16} className="mr-1.5" />
                  ref_eyeblink
                  <span
                    className="ml-1.5"
                    style={{ color: 'hsl(0, 0%, 52.3%)' }}
                  >
                    file
                  </span>
                </div>
              </FormLabel>
              <FormControl>
                <Input
                  type="file"
                  id="ref_eyeblink"
                  onChange={(event) => handleFileUpload(event, 'ref_eyeblink')}
                />
              </FormControl>
              <FormDescription>
                path to reference video providing eye blinking
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="ref_pose"
          render={() => (
            <FormItem>
              <FormLabel>
                <div className="flex">
                  <File size={16} className="mr-1.5" />
                  ref_pose
                  <span
                    className="ml-1.5"
                    style={{ color: 'hsl(0, 0%, 52.3%)' }}
                  >
                    file
                  </span>
                </div>
              </FormLabel>
              <FormControl>
                <Input
                  type="file"
                  id="ref_pose"
                  onChange={(event) => handleFileUpload(event, 'ref_pose')}
                />
              </FormControl>
              <FormDescription>
                path to reference video providing pose
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="still"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={(event) => {
                    field.onChange(event);
                    handleCheck(event, 'still');
                  }}
                />
              </FormControl>
              <FormLabel className="ml-1.5">
                still
                <span className="ml-1.5" style={{ color: 'hsl(0, 0%, 52.3%)' }}>
                  boolean
                </span>
              </FormLabel>
              <FormDescription>
                can crop back to the original videos for the full body aniamtion
                when preprocess is full
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="button" onClick={onSubmit}>
          Submit
        </Button>
      </form>
    </Form>
  );
};

export default PlaygroundInput;