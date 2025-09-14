'use client';

import { Button } from "@/components/ui/button";
import { Plus, Search, Eye, Calendar } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import { formatDate } from "@/lib/utils";

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  category: 'policy' | 'climate_change' | 'overfishing' | 'iuu_fishing';
  author: string;
  publishedAt: string;
  readCount: number;
  isPublished: boolean;
}

const mockBlogs: BlogPost[] = [
  {
    id: "1",
    title: "Climate Change Impact on Sri Lankan Fisheries",
    excerpt: "Understanding how climate change affects Sri Lankan fisheries and what can be done about it.",
    category: "climate_change",
    author: "Dr. Marine Researcher",
    publishedAt: "2025-01-15",
    readCount: 245,
    isPublished: true
  },
  {
    id: "2",
    title: "New Fishing Regulations for 2025",
    excerpt: "Overview of the latest policy changes affecting the fishing industry in Sri Lanka.",
    category: "policy",
    author: "Policy Analyst",
    publishedAt: "2025-01-10",
    readCount: 189,
    isPublished: true
  },
  {
    id: "3",
    title: "Combating Overfishing: Sustainable Practices",
    excerpt: "Exploring sustainable fishing methods to preserve marine ecosystems for future generations.",
    category: "overfishing",
    author: "Conservation Expert",
    publishedAt: "2025-01-08",
    readCount: 312,
    isPublished: true
  },
  {
    id: "4",
    title: "Illegal Fishing: Detection and Prevention",
    excerpt: "Advanced methods for identifying and preventing illegal, unreported, and unregulated fishing activities.",
    category: "iuu_fishing",
    author: "Maritime Security",
    publishedAt: "2025-01-05",
    readCount: 156,
    isPublished: true
  }
];

const getCategoryColor = (category: string) => {
  const colors = {
    policy: 'bg-blue-100 text-blue-800',
    climate_change: 'bg-red-100 text-red-800',
    overfishing: 'bg-yellow-100 text-yellow-800',
    iuu_fishing: 'bg-purple-100 text-purple-800'
  };
  return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800';
};

const formatCategory = (category: string) => {
  return category.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
};

export default function BlogsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const filteredBlogs = mockBlogs.filter(blog => {
    const matchesSearch = blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         blog.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || blog.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const publishedBlogs = filteredBlogs.filter(blog => blog.isPublished);
  const draftBlogs = filteredBlogs.filter(blog => !blog.isPublished);

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex flex-col md:flex-row justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Blog Management</h1>
          <p className="text-muted-foreground">
            Manage fisheries-related blog posts and articles
          </p>
        </div>
        <Button variant="default" size="sm">
          <Plus className="h-4 w-4 mr-2" />
          New Article
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Published</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{publishedBlogs.length}</div>
            <p className="text-xs text-muted-foreground">Active articles</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Draft</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{draftBlogs.length}</div>
            <p className="text-xs text-muted-foreground">Unpublished drafts</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Views</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {mockBlogs.reduce((sum, blog) => sum + blog.readCount, 0).toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">All time views</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4</div>
            <p className="text-xs text-muted-foreground">Active categories</p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search articles..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8"
          />
        </div>
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="policy">Policy</SelectItem>
            <SelectItem value="climate_change">Climate Change</SelectItem>
            <SelectItem value="overfishing">Overfishing</SelectItem>
            <SelectItem value="iuu_fishing">IUU Fishing</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Tabs defaultValue="published" className="space-y-4">
        <TabsList>
          <TabsTrigger value="published">
            Published ({publishedBlogs.length})
          </TabsTrigger>
          <TabsTrigger value="drafts">
            Drafts ({draftBlogs.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="published" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {publishedBlogs.map((blog) => (
              <Card key={blog.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <Badge className={getCategoryColor(blog.category)}>
                      {formatCategory(blog.category)}
                    </Badge>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Eye className="h-3 w-3" />
                      {blog.readCount}
                    </div>
                  </div>
                  <CardTitle className="text-lg">{blog.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    {blog.excerpt}
                  </p>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>By {blog.author}</span>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {formatDate(blog.publishedAt)}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mt-4">
                    <Button variant="outline" size="sm" className="flex-1">
                      Edit
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1">
                      View
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="drafts" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {draftBlogs.length > 0 ? (
              draftBlogs.map((blog) => (
                <Card key={blog.id} className="hover:shadow-md transition-shadow border-dashed">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <Badge variant="secondary">
                        {formatCategory(blog.category)}
                      </Badge>
                      <Badge variant="outline">Draft</Badge>
                    </div>
                    <CardTitle className="text-lg">{blog.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      {blog.excerpt}
                    </p>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>By {blog.author}</span>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {formatDate(blog.publishedAt)}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 mt-4">
                      <Button size="sm" className="flex-1">
                        Publish
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1">
                        Edit
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="col-span-full text-center py-8">
                <p className="text-muted-foreground">No draft articles found</p>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}