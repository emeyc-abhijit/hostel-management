import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

interface FeeStructure {
  id: string;
  category: string;
  amount: number;
  description: string;
}

interface EditFeeStructureModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  fee: FeeStructure | null;
  onSave: (fee: FeeStructure) => void;
  isNew?: boolean;
}

export function EditFeeStructureModal({ 
  open, 
  onOpenChange, 
  fee, 
  onSave,
  isNew = false 
}: EditFeeStructureModalProps) {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    category: '',
    amount: '',
    description: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (fee && !isNew) {
      setFormData({
        category: fee.category,
        amount: fee.amount.toString(),
        description: fee.description
      });
    } else {
      setFormData({
        category: '',
        amount: '',
        description: ''
      });
    }
    setErrors({});
  }, [fee, isNew, open]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.category.trim()) {
      newErrors.category = 'Category name is required';
    } else if (formData.category.length > 50) {
      newErrors.category = 'Category name must be less than 50 characters';
    }
    
    if (!formData.amount) {
      newErrors.amount = 'Amount is required';
    } else if (isNaN(Number(formData.amount)) || Number(formData.amount) <= 0) {
      newErrors.amount = 'Please enter a valid amount greater than 0';
    } else if (Number(formData.amount) > 1000000) {
      newErrors.amount = 'Amount must be less than ₹10,00,000';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    } else if (formData.description.length > 200) {
      newErrors.description = 'Description must be less than 200 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    const updatedFee: FeeStructure = {
      id: isNew ? `fee-${Date.now()}` : (fee?.id || ''),
      category: formData.category.trim(),
      amount: Number(formData.amount),
      description: formData.description.trim()
    };

    onSave(updatedFee);
    onOpenChange(false);
    
    toast({
      title: isNew ? 'Fee Category Added' : 'Fee Category Updated',
      description: `${updatedFee.category} has been ${isNew ? 'added' : 'updated'} successfully.`,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {isNew ? 'Add Fee Category' : 'Edit Fee Category'}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="category">Category Name</Label>
            <Input
              id="category"
              placeholder="e.g., Room Rent, Mess Charges"
              value={formData.category}
              onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
              className={errors.category ? 'border-destructive' : ''}
            />
            {errors.category && (
              <p className="text-sm text-destructive">{errors.category}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount">Amount (₹)</Label>
            <Input
              id="amount"
              type="number"
              placeholder="e.g., 25000"
              value={formData.amount}
              onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
              className={errors.amount ? 'border-destructive' : ''}
            />
            {errors.amount && (
              <p className="text-sm text-destructive">{errors.amount}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Brief description of this fee category..."
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              className={errors.description ? 'border-destructive' : ''}
              rows={3}
            />
            {errors.description && (
              <p className="text-sm text-destructive">{errors.description}</p>
            )}
          </div>

          <DialogFooter className="gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">
              {isNew ? 'Add Category' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
