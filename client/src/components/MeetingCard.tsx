// client/src/components/MeetingCard.tsx
"use client";
import { Calendar, Clock, Copy, Users, RefreshCw, ArrowRight } from "lucide-react";
import toast from "react-hot-toast";

interface Meeting {
  _id: string;
  title: string;
  startTime: string;
  meetingLink: string;
  attendees: string[];
}

export default function MeetingCard({ meeting }: { meeting: Meeting }) {
  const copyToClipboard = (link: string) => {
    navigator.clipboard.writeText(link);
    toast.success("Link copied!");
  };

  const isProcessing = meeting.meetingLink === 'processing...';
  const meetingDate = new Date(meeting.startTime);

  return (
    // The main card container with hover effects
    <div className="bg-card border border-border rounded-xl p-6 group transition-all duration-300 hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/10">
      <div className="flex flex-col justify-between h-full">
        {/* Top section: Title and details */}
        <div>
          <h3 className="font-bold text-lg text-foreground mb-3 truncate">{meeting.title}</h3>
          <div className="flex items-center flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground mb-6">
            <div className="flex items-center gap-2"><Calendar size={14} /><span>{meetingDate.toLocaleDateString(undefined, { month: 'long', day: 'numeric' })}</span></div>
            <div className="flex items-center gap-2"><Clock size={14} /><span>{meetingDate.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}</span></div>
            <div className="flex items-center gap-2"><Users size={14} /><span>{meeting.attendees?.length || 0} Attendees</span></div>
          </div>
        </div>

        {/* Bottom section: Link and action button */}
        <div className="space-y-4">
          {isProcessing ? (
            <div className="flex items-center justify-center space-x-2 text-yellow-400 h-10"><RefreshCw className="w-4 h-4 animate-spin" /><span>Processing link...</span></div>
          ) : (
            <div className="group/link flex items-center bg-background border border-border rounded-md p-1">
              <input type="text" value={meeting.meetingLink} readOnly className="flex-grow bg-transparent p-1 text-sm text-foreground focus:outline-none" />
              <button onClick={() => copyToClipboard(meeting.meetingLink)} className="p-2 text-muted-foreground group-hover/link:text-primary transition-colors"><Copy size={16} /></button>
            </div>
          )}
          <button className="w-full flex justify-center items-center gap-2 px-4 py-2 text-sm font-semibold border border-border rounded-lg hover:bg-border hover:text-primary transition-colors">
            <span>View Details</span><ArrowRight className="transition-transform group-hover:translate-x-1" size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}