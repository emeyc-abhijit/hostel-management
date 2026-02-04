import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Bell, Pin, Calendar, ArrowRight, Megaphone, AlertTriangle, Info, Sparkles } from 'lucide-react';

const noticesData = {
  unread: 3,
  total: 12,
  notices: [
    {
      id: 'N001',
      title: 'Hostel Fee Payment Deadline Extended',
      category: 'Fee',
      priority: 'high',
      date: '2024-01-12',
      isPinned: true,
      isNew: true,
    },
    {
      id: 'N002',
      title: 'Maintenance Work on 3rd Floor',
      category: 'Maintenance',
      priority: 'medium',
      date: '2024-01-11',
      isPinned: false,
      isNew: true,
    },
    {
      id: 'N003',
      title: 'Republic Day Celebration',
      category: 'Event',
      priority: 'low',
      date: '2024-01-10',
      isPinned: false,
      isNew: true,
    },
    {
      id: 'N004',
      title: 'Updated Mess Menu for January',
      category: 'General',
      priority: 'low',
      date: '2024-01-08',
      isPinned: false,
      isNew: false,
    },
  ],
};

const categoryConfig = {
  Fee: { icon: AlertTriangle, color: 'text-destructive', bg: 'bg-destructive/10', ring: 'ring-destructive/20' },
  Maintenance: { icon: Info, color: 'text-warning', bg: 'bg-warning/10', ring: 'ring-warning/20' },
  Event: { icon: Megaphone, color: 'text-primary', bg: 'bg-primary/10', ring: 'ring-primary/20' },
  General: { icon: Bell, color: 'text-muted-foreground', bg: 'bg-muted', ring: 'ring-border' },
};

export function StudentNoticesWidget() {
  return (
    <Card className="group h-full overflow-hidden border-border/50 hover:border-primary/20 hover:shadow-card-hover transition-all duration-300">
      {/* Decorative top gradient */}
      <div className="h-1 bg-gradient-to-r from-primary via-accent/50 to-transparent" />
      
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <div className="p-2 rounded-xl bg-primary/10">
              <Bell className="h-5 w-5 text-primary" />
            </div>
            <span>Notices & Announcements</span>
          </CardTitle>
          {noticesData.unread > 0 && (
            <Badge className="rounded-full px-3 font-bold bg-gradient-to-r from-destructive to-destructive/80 text-destructive-foreground animate-pulse-soft">
              {noticesData.unread} new
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Notice List */}
        <div className="space-y-2">
          {noticesData.notices.map((notice, index) => {
            const category = categoryConfig[notice.category as keyof typeof categoryConfig] || categoryConfig.General;
            const CategoryIcon = category.icon;
            
            return (
              <div 
                key={notice.id} 
                className={`group/item p-4 rounded-xl border transition-all duration-200 hover:shadow-md ${
                  notice.isNew 
                    ? 'border-primary/30 bg-gradient-to-r from-primary/5 to-transparent hover:border-primary/50' 
                    : 'border-border/50 hover:border-border hover:bg-muted/30'
                }`}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="flex items-start gap-3">
                  <div className={`p-2.5 rounded-xl ${category.bg} ring-1 ${category.ring} shrink-0 transition-transform group-hover/item:scale-110`}>
                    <CategoryIcon className={`h-4 w-4 ${category.color}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      {notice.isPinned && (
                        <Pin className="h-3.5 w-3.5 text-primary shrink-0" />
                      )}
                      <p className="text-sm font-semibold line-clamp-1 group-hover/item:text-primary transition-colors">
                        {notice.title}
                      </p>
                      {notice.isNew && (
                        <Badge className="text-[10px] px-2 py-0 h-5 shrink-0 bg-gradient-to-r from-primary to-accent text-white font-bold rounded-full flex items-center gap-1">
                          <Sparkles className="h-2.5 w-2.5" />
                          NEW
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="outline" className="text-xs rounded-full font-medium">
                        {notice.category}
                      </Badge>
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(notice.date).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                        })}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* View All Link */}
        <Link to="/notices">
          <Button variant="outline" className="w-full rounded-xl h-11 font-semibold hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all duration-200">
            View All Notices
            <ArrowRight className="h-4 w-4 ml-2 transition-transform group-hover:translate-x-1" />
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}
